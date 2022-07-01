import React from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";

const ConversationContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-top: 15px;

  &:hover {
    background-color: #d3d3d3;
  }
`;

const Name = styled.span`
  font-weight: 500;
  margin-left: 20px;
`;

function Conversation({ conversation, currentuser }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentuser.id);

    const getUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/user?userId=` + friendId);
        console.log(res.data);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentuser, conversation]);

  return (
    <ConversationContainer>
      <Avatar></Avatar>
      <Name>{user?.user.displayName}</Name>
    </ConversationContainer>
  );
}

export default Conversation;
