const socketServer = (app, server) => {
    const SOCKET_ORIGIN = process.env.SOCKET_ORIGIN || "http://localhost:3000";
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", SOCKET_ORIGIN);
        next();
    });
    const io = require("socket.io")(server, {
        cors: {
            origin: SOCKET_ORIGIN
        }
    });
    console.log("socket-io: Server initialised");

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
        console.log("socket-io: A user just got connected");
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
            console.log(`socket-io error: Invalid receiver ID ${receiverId}`);
            }
        });
        //When disconnect
        socket.on("disconnect", () => {
            console.log("socket-io: A user just got disconnected");
            removeUser(socket.id);
            io.emit("getUsers", users);
        });
    });
};

module.exports = socketServer;