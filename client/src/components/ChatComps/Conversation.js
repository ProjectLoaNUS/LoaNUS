import React from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";
import { Buffer } from "buffer";

const ConversationContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-top: 15px;
  cursor: pointer;

  &:hover {
    background-color: #d3d3d3;
  }
`;

const Name = styled.span`
  font-weight: 500;
  margin-left: 20px;
`;

function Conversation({ conversation, currentuser, search }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentuser.id);

    const getUser = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/user/getUserDetails?userId=` + friendId
        );
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentuser, conversation]);
  const Bintourl = (data, contentType) => {
    if (data && contentType) {
      const binary = Buffer.from(data);
      const blob = new Blob([binary.buffer], { type: contentType });
      const url = URL.createObjectURL(blob);
      return url;
    } else {
      return null;
    }
  };

  if (user?.user.displayName.toLowerCase().includes(search.toLowerCase())) {
    return (
      <ConversationContainer>
        <Avatar src={Bintourl(user?.user.photodata, user?.user.photoformat)}>
          {user?.user.displayName[0]}
        </Avatar>
        <Name>{user?.user.displayName}</Name>
      </ConversationContainer>
    );
  }
  return null;
}

export default Conversation;
