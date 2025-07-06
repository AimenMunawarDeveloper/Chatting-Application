const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "emoji"],
      default: "text",
    },
    attachment: {
      url: String,
      fileName: String,
      fileType: String,
      fileSize: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Message = new mongoose.model("Message", messageSchema);

module.exports = Message;
