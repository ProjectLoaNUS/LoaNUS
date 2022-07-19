const notifications = (socketUtils) => {
    const notify = (senderId, receiverId, message, targetUrl) => {
        if (!!receiverId) {
            const receiver = socketUtils.getUser(receiverId);
            if (receiver) {
                socketUtils.io.to(receiver.socketId).emit("notification", {
                    senderId: senderId,
                    message: message,
                    targetUrl: targetUrl
                });
            } else {
                console.log(`Invalid receiver ID ${receiverId} given to notifications.js`);
            }
        } else {
            socketUtils.io.emit("notification", {
                senderId: senderId,
                message: message,
                targetUrl: targetUrl
            });
        }
    };
    return {
        notify: notify
    };
}

module.exports = notifications;