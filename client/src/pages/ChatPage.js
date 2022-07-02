import React from "react";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { useAuth } from "../database/auth";
import axios from "axios";
import Message from "../components/ChatComps/Message";
import ChatOnline from "../components/ChatComps/ChatOnline";
import { BACKEND_URL, SOCKET_URL } from "../database/const";
import Conversation from "../components/ChatComps/Conversation";
import ButtonComponent from "../components/Button";
import { Avatar } from "@mui/material";
import { io } from "socket.io-client";
import { CollectionsBookmarkOutlined } from "@mui/icons-material";

const ChatContainer = styled.div`
  height: calc(100vh - 10vh);
  display: flex;
`;
//ChatMenu
const ChatMenuContainer = styled.div`
  flex: 3.5;
`;
const MenuWrapper = styled.div`
  padding: 10px;
  height: 100%;
`;
const ChatMenuInput = styled.input`
  width: 90%;
  padding: 10px 0;
  border: none;
  border-bottom: 1px solid gray;
`;
//Chatbox
const ChatBoxContainer = styled.div`
  flex: 5.5;
`;
const NoConversationDisplay = styled.span`
  position: absolute;
  top: 20%;
  font-size: 50px;
  color: lightgray;
  text-align: center;
`;
const ChatBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
`;
const ChatTop = styled.div`
  height: 100%;
  overflow-y: scroll;
  padding-right: 10px;
`;
const ChatBottom = styled.div`
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
//Online
const MainOnlineContainer = styled.div`
  flex: 3;
`;
const OnlineContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  margin-top: 10px;
  padding: 10px;
`;
const ImageContainer = styled.div`
  position: relative;
  margin-right: 10px;
`;
const OnlineIcon = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: limegreen;
  top: 2px;
  right: 2px;
`;
const Name = styled.span``;

function ChatPage() {
  const { user, setUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newmessage, setNewMessage] = useState("");
  const [arrivalmessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const scrollRef = useRef();
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [user, setUser]);

  useEffect(() => {
    socket.current = io(SOCKET_URL);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalmessage &&
      currentChat?.members.includes(arrivalmessage.sender) &&
      setMessages((prev) => [...prev, arrivalmessage]);
  }, [arrivalmessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user?.id);
    socket.current.on("getUsers", (users) => {
      fetch(`${BACKEND_URL}/api/getNamesOfUsers`, {
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
        setOnlineUsers(data.userDetails);
      });
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/conversations/` + user.id
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/messages/` + currentChat?._id
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user.id,
      text: newmessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find((member) => member !== user.id);
    socket.current.emit("sendMessage", {
      senderId: user.id,
      receiverId,
      text: newmessage,
    });
    try {
      const res = await axios.post(`${BACKEND_URL}/api/messages`, message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      <NavigationBar></NavigationBar>
      <ChatContainer>
        <ChatMenuContainer>
          <MenuWrapper>
            <ChatMenuInput placeholder="Search for friends" />
            {conversations.map((conv) => (
              <div onClick={() => setCurrentChat(conv)}>
                <Conversation conversation={conv} currentuser={user} />
              </div>
            ))}
          </MenuWrapper>
        </ChatMenuContainer>
        <ChatBoxContainer>
          <ChatBoxWrapper>
            {currentChat ? (
              <>
                <ChatTop>
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user.id} />
                    </div>
                  ))}
                </ChatTop>
                <ChatBottom>
                  <TextBox
                    value={newmessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write Something"
                  ></TextBox>
                  <ButtonComponent
                    state="primary"
                    text={"Send"}
                    onClick={handleSubmit}
                  ></ButtonComponent>
                </ChatBottom>{" "}
              </>
            ) : (
              <NoConversationDisplay>
                Open a conversation to start a chat
              </NoConversationDisplay>
            )}
          </ChatBoxWrapper>
        </ChatBoxContainer>
        <ChatOnline currentId={user?.id} setCurrentChat={setCurrentChat} onlineUsers={onlineUsers} />
      </ChatContainer>
    </>
  );
}

export default ChatPage;
