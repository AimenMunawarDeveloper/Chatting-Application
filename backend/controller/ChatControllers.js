const asyncHandler = require("express-async-handler");

// create or fetch one to one chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("user id not send with request");
    return res.sendStatus(400);
  }
});

const fetchChats = asyncHandler(async (req, res) => {});

const createGroupChat = asyncHandler(async (req, res) => {});

const removeFromGroup = asyncHandler(async (req, res) => {});
const addToGroup = asyncHandler(async (req, res) => {});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
};
