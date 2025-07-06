const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    groupChat: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const Chat = new mongoose.model("Chat", chatSchema);

module.exports = Chat;
