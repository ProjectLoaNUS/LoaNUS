import React from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { BACKEND_URL } from "../../database/const";
import { Buffer } from "buffer";

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
  const Bintourl = (image) => {
    if (image) {
      const binary = Buffer.from(image.data);
      const blob = new Blob([binary.buffer], { type: image.contentType });
      const url = URL.createObjectURL(blob);
      return url;
    } else {
      return null;
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
              <Avatar src={Bintourl(user.image)}>
                {user && !user.image ? user.name[0] : "U"}
              </Avatar>
              <OnlineIcon></OnlineIcon>
            </ImageContainer>
            <Name>{user.name}</Name>
          </OnlineContainer>
        ))}
    </MainOnlineContainer>
  );
}

export default ChatOnline;
