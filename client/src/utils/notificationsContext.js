const { createContext, useState, useContext } = require("react");

const notificationsContext = createContext({
    notifications: [],
    startNotifications: null,
    notify: null
});

function useNotificationsProvider() {
    const [ notifications, setNotifications ] = useState([]);
    const [ socket, setSocket ] = useState(null);

    const startNotifications = async (socket) => {
        if (socket) {
            setSocket(socket);
            socket.on("notification", ({senderId, message, targetUrl}) => {
                setNotifications(prevNotifs => {
                    return [
                        ...prevNotifs, 
                        {senderId: senderId, message: message, targetUrl: targetUrl, date: new Date()}
                    ];
                });
            });
        } else {
            console.log("Error starting notifications in notificationsContext: 'socket' object is invalid");
        }
    }

    const notify = async (senderId, receiverId, message, targetUrl) => {
        if (socket) {
            socket.emit("notify", {senderId, receiverId, message, targetUrl});
        } else {
            console.log("Error while sending notification in notificationsContext.js: 'socket' object is invalid");
        }
    }

    return {
        notifications,
        startNotifications,
        notify
    };
}

export const useNotifications = () => {
    return useContext(notificationsContext);
}

export function NotificationsProvider(props) {
    const { children } = props;
    const notificationsProvider = useNotificationsProvider();
    return (
        <notificationsContext.Provider value={notificationsProvider}>
            {children}
        </notificationsContext.Provider>
    )
}