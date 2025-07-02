const asyncHandler = require("express-async-handler");
const Notification = require("../models/NotificationModel");

// Get all notifications for a user
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id,
    isRead: false,
  })
    .populate("chat")
    .populate("message");
  res.json(notifications);
});

// Mark notifications as read for a chat
const markAsRead = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  await Notification.updateMany(
    { user: req.user._id, chat: chatId, isRead: false },
    { isRead: true }
  );
  res.json({ success: true });
});

// Add a notification (used internally)
const addNotification = async (userId, chatId, messageId) => {
  await Notification.create({ user: userId, chat: chatId, message: messageId });
};

module.exports = { getNotifications, markAsRead, addNotification };
