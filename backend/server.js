const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { chats } = require("./dummy data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/UserRoutes");
const chatRoutes = require("./routes/ChatRoutes");

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
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
const port = process.env.PORT || 5000;
app.listen(port, console.log(`server started on port ${port}`.yellow.bold));
