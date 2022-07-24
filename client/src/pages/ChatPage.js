import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { useAuth } from "../database/auth";
import axios from "axios";
import ChatOnline from "../components/ChatComps/ChatOnline";
import { BACKEND_URL } from "../database/const";
import Conversation from "../components/ChatComps/Conversation";
import { useNavigate } from "react-router-dom";
import { SIGN_IN } from "./routes";
import ChatBox from "../components/ChatComps/ChatBox";
import { useSocket } from "../utils/socketContext";

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
  const { user, isUserLoaded } = useAuth();
  const [ conversations, setConversations ] = useState([]);
  const [ currentChat, setCurrentChat ] = useState(null);
  const [ following, setFollowing ] = useState(null);
  const [ followers, setFollowers ] = useState(null);
  const [ usersOnline, setUsersOnline ] = useState(null);
  const { onlineUsers } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && isUserLoaded) {
      navigate(SIGN_IN, {
        state: {
          open: true, 
          message: "Sign in before chatting with other users"
        }
      });
    }
  }, [user]);

  useEffect(() => {
    const getfollowing = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `${BACKEND_URL}/api/follow/getfollowingid?userId=` + user.id
          );
          setFollowing(res.data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getfollowing();
  }, [user]);
  useEffect(() => {
    const getfollowers = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `${BACKEND_URL}/api/follow/getfollowersid?userId=` + user.id
          );
          setFollowers(res.data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getfollowers();
  }, [user]);

  const getConversations = useCallback(async () => {
    if (user) {
      try {
        axios.get(`${BACKEND_URL}/api/conversations/` + user.id).then((res) => {
          setConversations(res.data);
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [user]);
  useEffect(() => {
    getConversations();
  }, [getConversations]);

  const getOnlineFollows = useCallback(() => {
    if (followers && following && onlineUsers) {
      const followOnlineUsers = onlineUsers.filter(other => (followers.includes(other._id) || following.includes(other._id)));
      setUsersOnline(followOnlineUsers);
    }
  }, [onlineUsers, followers, following]);
  useEffect(() => {
    getOnlineFollows();
  }, [getOnlineFollows]);

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
            currentChat={currentChat} />
        </ChatBoxContainer>
        <ChatOnline
          currentId={user?.id}
          setCurrentChat={setCurrentChat}
          onlineUsers={usersOnline}
        />
      </ChatContainer>
    </PageContainer>
  );
}

export default ChatPage;
