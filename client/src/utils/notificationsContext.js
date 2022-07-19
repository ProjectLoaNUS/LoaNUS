const { createContext, useState, useContext } = require("react");

const notificationsContext = createContext({
    notifications: [],
    startNotifications: null
});

function useNotificationsProvider() {
    const [ notifications, setNotifications ] = useState([]);

    const startNotifications = async (socket) => {
        if (socket) {
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

    return {
        notifications,
        startNotifications
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