import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL } from "../database/const";

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
                fetch(`${BACKEND_URL}/api/user/getNamesOf`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        users: users.filter(otherUser => otherUser.userId !== user.id)
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'ok') {
                        setOnlineUsers(data.userDetails);
                    } else {
                        console.log("socketContext: Error fetching names of online users from backend");
                    }
                });
            });
        } else {
            console.log("socketContext: Invalid user object");
        }
    }

    const postConnectSocket = async (mySocket, user) => {
        markUserAsOnline(mySocket, user);
        updateOnlineUsers(mySocket, user);
    }

    const connectSocket = (myUser) => {
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