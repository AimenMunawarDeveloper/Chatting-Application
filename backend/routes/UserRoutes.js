const express = require("express");
const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controller/UserController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, allUsers);

module.exports = router;
