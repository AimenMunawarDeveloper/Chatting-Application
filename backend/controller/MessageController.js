const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");
const { addNotification } = require("./NotificationController");

// Send a message to a chat
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, messageType, attachment } = req.body;
  if ((!content && !attachment) || !chatId) {
    return res
      .status(400)
      .json({ message: "Invalid data passed into request" });
  }
  let newMessage = {
    sender: req.user._id,
    content: content || "",
    chat: chatId,
    messageType: messageType || "text",
  };

  if (attachment) {
    newMessage.attachment = attachment;
  }
  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic email");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    // Add notifications for all users except sender
    const chatUsers = message.chat.users;
    // Get io instance
    const io = req.app.get("io");
    console.log("Message sender:", req.user._id);
    console.log(
      "Chat users:",
      chatUsers.map((u) => u._id)
    );
    console.log("IO instance:", !!io);

    for (const user of chatUsers) {
      if (user._id.toString() !== req.user._id.toString()) {
        console.log("Creating notification for user:", user._id);
        try {
          // Create notification in database with sender and content
          const notification = await addNotification(
            user._id,
            chatId,
            message._id,
            req.user._id,
            content
          );

          // Emit socket notification with full notification data
          if (io) {
            console.log("Emitting notification to user:", user._id.toString());
            io.in(user._id.toString()).emit("notification", {
              _id: notification._id,
              chatId,
              message: {
                _id: message._id,
                content: content,
                createdAt: message.createdAt,
                sender: {
                  _id: req.user._id,
                  name: req.user.name,
                  pic: req.user.pic,
                },
                chat: {
                  _id: chatId,
                  name: message.chat.name,
                  isGroupChat: message.chat.groupChat,
                },
              },
            });
          }
        } catch (error) {
          console.error("Error sending notification:", error);
        }
      }
    }
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch all messages for a chat
const fetchMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = { sendMessage, fetchMessages };
