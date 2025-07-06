const asyncHandler = require("express-async-handler");
const Notification = require("../models/NotificationModel");

// Get all notifications for a user
const getNotifications = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching notifications for user:", req.user._id);
    const notifications = await Notification.find({
      user: req.user._id,
      isRead: false,
    })
      .populate("chat")
      .populate("message")
      .populate("sender", "name pic")
      .sort({ createdAt: -1 });

    console.log("Found notifications:", notifications.length);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// Mark notifications as read for a chat
const markAsRead = asyncHandler(async (req, res) => {
  const { chatId, notificationId } = req.body;
  try {
    console.log("Marking notifications as read:", { chatId, notificationId });

    let query = { user: req.user._id, isRead: false };

    // If notificationId is provided, only mark that specific notification as read
    if (notificationId) {
      query._id = notificationId;
    }
    // If chatId is provided, mark all notifications for that chat as read
    else if (chatId) {
      query.chat = chatId;
    }

    const result = await Notification.updateMany(query, { isRead: true });

    console.log("Updated notifications:", result.modifiedCount);
    res.json({ success: true, count: result.modifiedCount });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ message: "Error updating notifications" });
  }
});

// Add a notification (used internally)
const addNotification = async (userId, chatId, messageId, sender, content) => {
  try {
    console.log("Creating notification for user:", userId);
    const notification = await Notification.create({
      user: userId,
      chat: chatId,
      message: messageId,
      sender: sender,
      content: content,
      type: "message",
    });
    console.log("Created notification:", notification._id);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

module.exports = { getNotifications, markAsRead, addNotification };
