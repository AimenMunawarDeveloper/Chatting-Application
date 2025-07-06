const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
// create or fetch one to one chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("user id not send with request");
    return res.sendStatus(400);
  }
  let isChat = await Chat.find({
    groupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chat = {
      name: "sender",
      groupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chat);
      const fullChat = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});
const fetchChats = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    let chats = await Chat.find({
      users: { $in: [userId] },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).send(chats);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching chats",
      error: error.message,
    });
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "fill all the fields" });
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "to create group chat more than 2 users are required" });
  }
  users.push(req.user);
  try {
    const chat = await Chat.create({
      name: req.body.name,
      groupChat: true,
      users: users,
      groupAdmin: req.user,
    });
    const groupChat = await Chat.findOne({ _id: chat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(groupChat);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating group chat", error: error.message });
  }
});
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, newName } = req.body;
  if (!chatId || !newName) {
    return res.status(400).json({ message: "chatId and newName are required" });
  }
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { name: newName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(updatedChat);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error renaming group", error: error.message });
  }
});
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    res.status(400);
    throw new Error("chat is not found");
  } else {
    res.json(removed);
  }
});
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const add = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!add) {
    res.status(400);
    throw new Error("chat is not found");
  } else {
    res.json(add);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  renameGroup,
  createGroupChat,
  removeFromGroup,
  addToGroup,
};
