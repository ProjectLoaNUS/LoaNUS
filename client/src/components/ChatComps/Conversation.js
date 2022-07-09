import React, { useCallback } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../database/const";
import { Buffer } from "buffer";

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

  const getUser = useCallback(async () => {
    try {
      const friendId = conversation.members.find((m) => m !== currentuser.id);
      fetch(`${BACKEND_URL}/api/user/getNamesOf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          users: [{userId: friendId}]
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok' && data.userDetails?.length) {
          setUser(data.userDetails[0]);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, [conversation, currentuser]);

  useEffect(() => {
    getUser();
  }, [getUser]);

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

  return (
    <ConversationContainer>
      <Avatar src={Bintourl(user?.user.photodata, user?.user.photoformat)}>
        {user?.name}
      </Avatar>
      <Name>{user?.name}</Name>
    </ConversationContainer>
  );
}

export default Conversation;
