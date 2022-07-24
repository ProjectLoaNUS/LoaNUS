import Message from "./Message";
import styled from "styled-components";
import ButtonComponent from "../Button";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../utils/socketContext";
import { useAuth } from "../../database/auth";
import { useNotifications } from "../../utils/notificationsContext";
import { CHAT } from "../../pages/routes";

const ChatBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
  overflow-y: auto;
`;
const ChatTop = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding-right: 10px;
`;
const ChatBottom = styled.div`
  flex: 0 0 auto;
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const TextBox = styled.textarea`
  width: 80%;
  height: 90px;
  padding: 10px;
`;
const NoConversationDisplay = styled.span`
  position: absolute;
  top: 20%;
  font-size: 50px;
  color: lightgray;
  text-align: center;
`;

export default function ChatBox(props) {
    const { currentChat } = props;
    const { user } = useAuth();
    const { socket } = useSocket();
    const { notify } = useNotifications();
    const [ messages, setMessages ] = useState([]);
    const [ arrivalMessage, setArrivalMessage ] = useState(null);
    const [ newMessage, setNewMessage ] = useState("");
    const chatRef = useRef(null);

    const onGetMessage = useCallback(async () => {
        if (socket) {
          socket.on("getMessage", (data) => {
            setArrivalMessage({
              sender: data.senderId,
              text: data.text,
              createdAt: Date.now(),
            });
          });
        }
    }, [socket]);
    
    useEffect(() => {
        onGetMessage();
    }, [onGetMessage]);
    
    useEffect(() => {
        arrivalMessage &&
          currentChat?.members.includes(arrivalMessage.sender) &&
          setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    const getMessages = useCallback(async () => {
        if (currentChat) {
          try {
            axios.get(
              `${BACKEND_URL}/api/messages/` + currentChat._id
            )
            .then(res => {
              setMessages(res.data);
            });
          } catch (err) {
            console.log(err);
          }
        }
    }, [currentChat]);
    useEffect(() => {
        getMessages();
    }, [getMessages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
          sender: user.id,
          text: newMessage,
          conversationId: currentChat._id,
        };
        const receiverId = currentChat.members.find((member) => member !== user.id);
        socket.emit("sendMessage", {
          senderId: user.id,
          receiverId,
          text: newMessage,
        });
        try {
          axios.post(`${BACKEND_URL}/api/messages`, message)
          .then(res => {
            setMessages([...messages, res.data]);
            setNewMessage("");
          });
          axios.post(`${BACKEND_URL}/api/user/getNamesOf`, {users: [{userId: receiverId}]})
            .then(res => {
              if (res.data.status === 'ok') {
                notify(user.id, receiverId, `New chat message from ${res.data.userDetails[0].name}`, CHAT);
              } else {
                console.log("Error fetching chat message sender name from backend");
              }
            });
        } catch (err) {
          console.log(err);
        }
    };
    useEffect(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

  return (
    <>
      <ChatBoxWrapper data-testid="wrapper">
        {currentChat ? (
          <>
            <ChatTop>
              {messages.map((m, index) => (
                <div key={index} ref={chatRef}>
                  <Message message={m} own={m.sender === user.id} />
                </div>
              ))}
            </ChatTop>
            <ChatBottom data-testid="chatbottom">
              <TextBox
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write Something"
              ></TextBox>
              <ButtonComponent
                state="primary"
                text="Send"
                onClick={handleSubmit}
              ></ButtonComponent>
            </ChatBottom>
          </>
        ) : (
          <NoConversationDisplay>
            Open a conversation to start a chat
          </NoConversationDisplay>
        )}
      </ChatBoxWrapper>
    </>
  );
}
