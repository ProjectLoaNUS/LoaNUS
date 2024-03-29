const { createContext, useState, useContext } = require("react");

const notificationsContext = createContext({
    notifications: [],
    startNotifications: null,
    notify: null,
    clearNotifications: null
});

function useNotificationsProvider() {
    const [ notifications, setNotifications ] = useState([]);
    const [ socket, setSocket ] = useState(null);

    const startNotifications = async (socket) => {
        if (socket) {
            setSocket(socket);
            socket.on("notification", ({senderId, message, targetUrl}) => {
                setNotifications(prevNotifs => {
                    const newNotifs = [
                        ...prevNotifs, 
                        {senderId: senderId, message: message, targetUrl: targetUrl, date: new Date()}
                    ];
                    localStorage.setItem("notifications", JSON.stringify(newNotifs));
                    return newNotifs;
                });
            });
        } else {
            console.log("Error starting notifications in notificationsContext: 'socket' object is invalid");
        }
    }

    const loadNotifications = async (savedNotifs) => {
        setNotifications(prevNotifs => {
            const newNotifs = [...savedNotifs, ...prevNotifs];
            localStorage.setItem("notifications", JSON.stringify(newNotifs));
            return newNotifs;
        });
    };

    const notify = async (senderId, receiverId, message, targetUrl) => {
        if (socket) {
            socket.emit("notify", {senderId, receiverId, message, targetUrl});
        } else {
            console.log("Error while sending notification in notificationsContext.js: 'socket' object is invalid");
        }
    }

    const rmNotification = async (notification) => {
        setNotifications(prevNotifications => {
            const newNotifs = prevNotifications.filter(other => other !== notification);
            localStorage.setItem("notifications", JSON.stringify(newNotifs));
            return newNotifs;
        });
    };

    const clearNotifications = async () => {
        setNotifications([]);
        localStorage.setItem("notifications", "");
    }

    return {
        notifications,
        startNotifications,
        loadNotifications,
        notify,
        rmNotification,
        clearNotifications
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