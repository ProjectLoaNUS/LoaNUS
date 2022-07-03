import { Server } from "socket.io";
import express from "express";

const port = process.env.PORT || 8000;
const app = express();
const httpServer = app.listen(port, () => {
  console.log('socket-io app is running on port ' + port);
});
const SOCKET_ORIGIN = process.env.SOCKET_ORIGIN || "http://localhost:3000";
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", SOCKET_ORIGIN);
  next();
});
const io = new Server(httpServer, {
  cors: {
    origin: SOCKET_ORIGIN
  }
});

let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
io.on("connection", (socket) => {
  //When connect
  console.log("a user connected");
  //retrieve userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  //Send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {  
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    } else {
      console.log(`Error: Invalid receiver ID ${receiverId}`);
    }
  });
  //When disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
