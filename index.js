// src/index.js
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

const cors = require("cors");

const port = 3000;
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("setName", (name) => {
    socket.username = name;
    console.log("user set the name", name);
    socket.emit("welcome", { message: `welcome to the chat ${name}` });
    socket.broadcast.emit("user_join", `${name} has joined the chat`);
  });

  socket.on("chat message", (msg, user) => {
    io.emit("chat message", { name: user, message: msg });
    console.log("message from client", msg, user);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id, socket.username);
    io.emit("user_gone", `User ${socket.username} left the chat`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//io is the server instance of our web socket
//socket is the individual client connection
//emit(event,data)
//on(event,callback)
// When you use .emit to send a message from one party (server or client) to another,
// you typically include some data payload along with the event name.
// When the receiving party listens for that event using .on, the callback function associated with .on will receive that
//  data payload as an argument.
