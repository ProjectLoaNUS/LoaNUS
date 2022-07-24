import React, { useCallback } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../database/const";
import { getProfilePicUrl } from "../../utils/getProfilePic";

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
  const [ userName, setUserName ] = useState("");
  const [ userPhotoUrl, setUserPhotoUrl ] = useState("");

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
          setUserName(data.userDetails[0].name);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, [conversation, currentuser]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const getProfilePic = useCallback(async () => {
    if (conversation && currentuser) {
      const friendId = conversation.members.find((m) => m !== currentuser.id);
      if (friendId) {
        const url = await getProfilePicUrl(friendId);
        setUserPhotoUrl(url);
      }
    }
  }, [conversation, currentuser]);

  useEffect(() => {
    getProfilePic();
  }, [getProfilePic]);

  if (userName.toLowerCase().includes(search.toLowerCase())) {
    return (
      <ConversationContainer>
        <Avatar src={userPhotoUrl} alt="U">
          {userName ?
              userName.charAt(0)
            :
              ""
          }
        </Avatar>
        <Name>{userName}</Name>
      </ConversationContainer>
    );
  }
  return null;
}

export default Conversation;
