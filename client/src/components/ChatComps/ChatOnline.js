import React from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { BACKEND_URL } from "../../database/const";

import axios from "axios";

const MainOnlineContainer = styled.div`
  flex: 3;
  overflow-y: auto;
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

function ChatOnline({ currentId, setCurrentChat, onlineUsers }) {
  const HandleClick = async (otherId) => {
    let convoUsers = {
      senderId: currentId,
      receiverId: otherId,
    };
    try {
      axios.post(`${BACKEND_URL}/api/conversations`, convoUsers).then((res) => {
        setCurrentChat(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <MainOnlineContainer>
      {onlineUsers &&
        onlineUsers.map((user, index) => (
          <OnlineContainer
            key={index}
            onClick={() => {
              HandleClick(user._id);
            }}
          >
            <ImageContainer>
              <Avatar></Avatar>
              <OnlineIcon></OnlineIcon>
            </ImageContainer>
            <Name>{user.name}</Name>
          </OnlineContainer>
        ))}
    </MainOnlineContainer>
  );
}

export default ChatOnline;
