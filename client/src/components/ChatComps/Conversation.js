import React, { useCallback } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../database/const";
import { getProfilePicUrl } from "../../utils/getProfilePic";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../utils/jwt-config";

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
  const [ showThisConvo, setShowThisConvo ] = useState(true);

  const getUser = useCallback(async () => {
    try {
      const friendId = conversation.members.find((m) => m !== currentuser.id);
      const token = jwt.sign(
        {id: currentuser.id},
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )
      fetch(`${BACKEND_URL}/api/user/getNamesOf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({
          users: [{userId: friendId}]
        })
      })
      .then(res => {
        res.json().then(data => {
            if (res.status === 200) {
              if (data.userDetails?.length) {
                setUserName(data.userDetails[0].name);
              } else {
                console.log("User details not returned by backend");
              }
            } else {
              console.log(data.error);
            }
        });
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

  useEffect(() => {
    if (search && userName) {
      if (userName.toLowerCase().includes(search.toLowerCase())) {
        setShowThisConvo(true);
      } else {
        setShowThisConvo(false);
      }
    } else {
      setShowThisConvo(true);
    }
  }, [userName, search]);

  if (showThisConvo) {
    return (
      <ConversationContainer>
        <Avatar src={userPhotoUrl} alt="U">
          {userName ?
              userName.charAt(0)
            :
              ""
          }
        </Avatar>
        <Name>{userName || "..."}</Name>
      </ConversationContainer>
    );
  }
  return null;
}

export default Conversation;
