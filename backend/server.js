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
const http = require("http");
const { Server } = require("socket.io");

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);
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
  socket.on("setup", (userData) => {
    socket.join(userData._id); // Each user joins a room with their user ID
    socket.emit("connected");
  });
  // Join chat room
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
  });
  // Listen for new messages and broadcast
  socket.on("new message", (message) => {
    if (!message.chat || !message.chat._id) return;
    io.to(message.chat._id).emit("message received", message);
    // Emit notification to all users except sender
    if (message.chat && message.chat.users) {
      message.chat.users.forEach((user) => {
        if (user._id !== message.sender._id) {
          io.to(user._id).emit("notification", {
            chatId: message.chat._id,
            message,
          });
        }
      });
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, console.log(`server started on port ${port}`.yellow.bold));
