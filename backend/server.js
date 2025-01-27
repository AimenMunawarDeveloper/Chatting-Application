const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { chats } = require("./dummy data/data");
const app = express();
dotenv.config();

app.use(cors());
app.get("/", (req, res) => {
  res.send("get api running");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});
app.get("/api/chat/:id", (req, res) => {
  //   console.log(req.params.id);
  const singleChat = chats.find((chat) => chat._id === req.params.id);
  res.send(singleChat);
});
const port = process.env.PORT || 5000;
app.listen(port, console.log(`server started on port ${port}`));
