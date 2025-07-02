const express = require("express");
const {
  getNotifications,
  markAsRead,
} = require("../controller/NotificationController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/read", protect, markAsRead);

module.exports = router;
