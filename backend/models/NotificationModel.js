const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    isRead: { type: Boolean, default: false },
    type: { type: String, default: "message" }, // message, groupAdd, etc.
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
