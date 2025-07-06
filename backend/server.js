const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { chats } = require("./dummy data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/UserRoutes");
const chatRoutes = require("./routes/ChatRoutes");
const messageRoutes = require("./routes/MessageRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");
const fileRoutes = require("./routes/FileRoutes");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/file", fileRoutes);
// app.get("/", (req, res) => {
//   res.send("get api running");
// });
// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });
// app.get("/api/chat/:id", (req, res) => {
//   //   console.log(req.params.id);
//   const singleChat = chats.find((chat) => chat._id === req.params.id);
//   res.send(singleChat);
// });
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Make io accessible in controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id); // Each user joins a room with their user ID
    socket.emit("connected");
    console.log("User joined room:", userData._id);
  });

  // Join chat room
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log("User joined chat:", chatId);
  });

  // Listen for new messages and broadcast
  socket.on("new message", (message) => {
    console.log("New message received in socket:", message._id);
    if (!message.chat || !message.chat._id) {
      console.log("Invalid message format - missing chat or chat ID");
      return;
    }

    // Broadcast message to all users in the chat
    console.log("Broadcasting message to chat room:", message.chat._id);
    socket.to(message.chat._id).emit("message received", message);

    // Note: Notifications are now handled in MessageController.js
    // to ensure consistency and avoid duplicate emissions
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, console.log(`server started on port ${port}`.yellow.bold));
