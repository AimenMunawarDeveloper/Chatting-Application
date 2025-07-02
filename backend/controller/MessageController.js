const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");
const { addNotification } = require("./NotificationController");

// Send a message to a chat
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res
      .status(400)
      .json({ message: "Invalid data passed into request" });
  }
  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
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
    for (const user of chatUsers) {
      if (user._id.toString() !== req.user._id.toString()) {
        await addNotification(user._id, chatId, message._id);
        // Emit notification via socket.io
        if (io) {
          io.to(user._id.toString()).emit("notification", {
            message,
            chatId,
          });
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
