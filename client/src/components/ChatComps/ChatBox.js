import Message from "./Message";
import styled from "styled-components";
import ButtonComponent from "../Button";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";
import { useEffect, useRef, useState } from "react";

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
    overflow-y: scroll;
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
    const { currentChat, messages, setMessages, socket, user } = props;
    const [ newMessage, setNewMessage ] = useState("");
    const chatRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
          sender: user.id,
          text: newMessage,
          conversationId: currentChat._id,
        };
        const receiverId = currentChat.members.find((member) => member !== user.id);
        socket.current.emit("sendMessage", {
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
        } catch (err) {
          console.log(err);
        }
    };

    useEffect(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <ChatBoxWrapper>
                {currentChat ? (
                    <>
                        <ChatTop>
                            {messages.map((m, index) => (
                                <div key={index} ref={chatRef}>
                                    <Message message={m} own={m.sender === user.id} />
                                </div>
                            ))}
                        </ChatTop>
                        <ChatBottom>
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
    )
}