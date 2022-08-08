const socketServer = (app, server) => {
    const SOCKET_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
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

    const notify = (senderId, receiverId, message, targetUrl) => {
        if (!!receiverId) {
            const receiver = getUser(receiverId);
            if (receiver) {
                io.to(receiver.socketId).emit("notification", {
                    senderId: senderId,
                    message: message,
                    targetUrl: targetUrl
                });
            } else {
                console.log(`Invalid receiver ID ${receiverId} given to notify()`);
            }
        } else {
            io.emit("notification", {
                senderId: senderId,
                message: message,
                targetUrl: targetUrl
            });
        }
    };

    io.on("connection", (socket) => {
        //When connect
        console.log("socket-io: A user just got connected");
        //retrieve userId and socketId from user
        socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
            io.emit("getUsers", users);
        });
        socket.on("notify", ({senderId, receiverId, message, targetUrl}) => {
            notify(senderId, receiverId, message, targetUrl);
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

    return {
        io: io,
        notify: notify
    };
};

module.exports = socketServer;