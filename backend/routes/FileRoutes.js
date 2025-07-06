const express = require("express");
const { uploadFile, upload } = require("../controller/FileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// File upload route
router.post("/upload", protect, upload.single("file"), uploadFile);

module.exports = router;
