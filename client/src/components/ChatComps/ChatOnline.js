import React from "react";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { BACKEND_URL } from "../../database/const";

import { useAuth } from "../../database/auth";
import axios from "axios";
import { current } from "@reduxjs/toolkit";
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

function ChatOnline({ currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(`${BACKEND_URL}/allusers`);
      setFriends(res.data);
    };
    getFriends();
  }, []);
  const HandleClick = async (otherId) => {
    let convoUsers = {
      senderId: currentId,
      receiverId: otherId,
    };
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/conversations`,
        convoUsers
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <MainOnlineContainer>
      {friends.map((f) => (
        <OnlineContainer
          onClick={() => {
            HandleClick(f._id);
          }}
        >
          <ImageContainer>
            <Avatar></Avatar>
            <OnlineIcon></OnlineIcon>
          </ImageContainer>
          <Name>{f.name}</Name>
        </OnlineContainer>
      ))}
    </MainOnlineContainer>
  );
}

export default ChatOnline;
