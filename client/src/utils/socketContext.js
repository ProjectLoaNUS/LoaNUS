import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../database/const";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "./jwt-config";

const socketContext = createContext({
    socket: null,
    connectSocket: null,
    disconnectSocket: null,
    onlineUsers: []
});

function useSocketProvider() {
    const [ socket, setSocket ] = useState(null);
    const [ onlineUsers, setOnlineUsers ] = useState([]);

    const markUserAsOnline = async (mySocket, user) => {
        if (user) {
            mySocket.emit("addUser", user.id);
        } else {
            console.log("socketContext: Unable to mark current user as online because user object is invalid");
        }
    }

    const updateOnlineUsers = async (mySocket, user) => {
        if (user) {
            mySocket.on("getUsers", (users) => {
                const otherUsers = users.filter(otherUser => otherUser.userId !== user.id);
                if (otherUsers.length) {
                    const token = jwt.sign(
                        {id: user.id},
                        JWT_SECRET,
                        {expiresIn: JWT_EXPIRES_IN}
                    );
                    fetch(`${BACKEND_URL}/api/user/getNamesOf`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": token
                        },
                        body: JSON.stringify({
                            users: otherUsers
                        })
                    })
                    .then(res => {
                        res.json().then(data => {
                            if (res.status === 200) {
                                setOnlineUsers(data.userDetails);
                            } else {
                                console.log(data.error);
                            }
                        });
                    });
                } else {
                    setOnlineUsers([]);
                }
            });
        } else {
            console.log("socketContext: Invalid user object");
        }
    }

    const postConnectSocket = async (mySocket, user) => {
        markUserAsOnline(mySocket, user);
        updateOnlineUsers(mySocket, user);
    }

    const connectSocket = async (myUser) => {
        const mySocket = io(BACKEND_URL);
        setSocket(mySocket);
        postConnectSocket(mySocket, myUser);
        return mySocket;
    }

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    }

    return {
        socket,
        connectSocket,
        disconnectSocket,
        onlineUsers
    };
}

export const useSocket = () => {
    return useContext(socketContext);
}

export function SocketProvider(props) {
    const { children } = props;
    const socketProvider = useSocketProvider();
    return <socketContext.Provider value={socketProvider}>{children}</socketContext.Provider>
}