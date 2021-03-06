import React from "react";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { useAuth } from "../database/auth";
import axios from "axios";
import ChatOnline from "../components/ChatComps/ChatOnline";
import { BACKEND_URL } from "../database/const";
import Conversation from "../components/ChatComps/Conversation";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { SIGN_IN } from "./routes";
import ChatBox from "../components/ChatComps/ChatBox";

const PageContainer = styled.div`
  height: 100vh;
`;
const ChatContainer = styled.div`
  height: 90vh;
  height: calc(100% - 10vh);
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;
//ChatMenu
const ChatMenuContainer = styled.div`
  flex: 3.5;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;
const MenuWrapper = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
`;
const ChatMenuInput = styled.input`
  width: 90%;
  padding: 10px 0;
  border: none;
  border-bottom: 1px solid gray;
  flex: 0 0 auto;
`;
//Chatbox
const ChatBoxContainer = styled.div`
  flex: 5.5;
  padding-bottom: 1ch;
`;

function ChatPage() {
  const { user, setUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [arrivalmessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const socket = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.log(err);
        }
      } else {
        navigate(SIGN_IN, {
          state: {
            open: true,
            message: "Sign in before chatting with other users",
          },
        });
      }
    }
  }, [user, setUser, navigate]);
  useEffect(() => {
    const getfollowing = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/follow/getfollowingid?userId=` + user.id
        );
        setFollowing(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getfollowing();
  }, [user]);
  useEffect(() => {
    const getfollowers = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/follow/getfollowersid?userId=` + user.id
        );
        setFollowers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getfollowers();
  }, [user]);

  useEffect(() => {
    socket.current = io(BACKEND_URL);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    arrivalmessage &&
      currentChat?.members.includes(arrivalmessage.sender) &&
      setMessages((prev) => [...prev, arrivalmessage]);
  }, [arrivalmessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user?.id);
    socket.current.on("getUsers", (users) => {
      fetch(`${BACKEND_URL}/api/user/getNamesOf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          users: users.filter(
            (otherUser) =>
              otherUser.userId !== user?.id &&
              (followers.includes(otherUser.userId) ||
                following.includes(otherUser.userId))
          ),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setOnlineUsers(data.userDetails);
        });
    });
  }, [user, followers, following]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        axios.get(`${BACKEND_URL}/api/conversations/` + user.id).then((res) => {
          setConversations(res.data);
        });
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        axios
          .get(`${BACKEND_URL}/api/messages/` + currentChat?._id)
          .then((res) => {
            setMessages(res.data);
          });
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  return (
    <PageContainer>
      <NavigationBar></NavigationBar>
      <ChatContainer>
        <ChatMenuContainer>
          <ChatMenuInput placeholder="Search for friends" />
          <MenuWrapper>
            {conversations.map((conv, index) => (
              <div key={index} onClick={() => setCurrentChat(conv)}>
                <Conversation conversation={conv} currentuser={user} />
              </div>
            ))}
          </MenuWrapper>
        </ChatMenuContainer>
        <ChatBoxContainer>
          <ChatBox
            currentChat={currentChat}
            messages={messages}
            setMessages={setMessages}
            socket={socket}
            user={user}
          />
        </ChatBoxContainer>
        <ChatOnline
          currentId={user?.id}
          setCurrentChat={setCurrentChat}
          onlineUsers={onlineUsers}
        />
      </ChatContainer>
    </PageContainer>
  );
}

export default ChatPage;
