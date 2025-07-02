const express = require("express");
const {
  sendMessage,
  fetchMessages,
} = require("../controller/MessageController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, fetchMessages);

module.exports = router;
