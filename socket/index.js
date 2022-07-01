import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const SOCKET_ORIGIN = process.env.SOCKET_ORIGIN;
let io;
if (SOCKET_ORIGIN) {
  // Heroku deployment
  io = new Server(httpServer, {
    cors: {
      origin: SOCKET_ORIGIN
    }
  });
} else {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000"
    }
  });
  
  httpServer.listen(8000);
}

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
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });
  //When disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
