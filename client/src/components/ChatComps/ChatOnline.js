import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, Badge } from "@mui/material";
import { BACKEND_URL } from "../../database/const";
import { Buffer } from "buffer";
import axios from "axios";
import { getProfilePicUrl } from "../../utils/getProfilePic";
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
const OnlineBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#00e676',
    color: '#00e676',
  }
}));
const Name = styled.span``;

function ChatOnline({ currentId, setCurrentChat, onlineUsers }) {
  const [ userPhotoUrls, setUserPhotoUrls ] = useState([]);

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

  const getProfilePics = useCallback(async () => {
    if (onlineUsers?.length) {
      onlineUsers.forEach(onlineUser => {
        getProfilePicUrl(onlineUser._id).then(url => {
          setUserPhotoUrls(prevUrls => {
            return [...prevUrls, url];
          });
        });
      });
    }
  }, [onlineUsers]);

  useEffect(() => {
    getProfilePics();
  }, [getProfilePics]);

  return (
    <MainOnlineContainer>
      {onlineUsers && onlineUsers.map((user, index) => (
        <OnlineContainer
          data-testid="online"
          key={index}
          onClick={() => {
            HandleClick(user._id);
          }} >
          <OnlineBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
            <Avatar src={userPhotoUrls[index]} alt="U">
              {user.name ?
                  user.name.charAt(0)
                : 
                  ""
              }
            </Avatar>
          </OnlineBadge>
          <Name>{user.name}</Name>
        </OnlineContainer>
      ))}
    </MainOnlineContainer>
  );
}

export default ChatOnline;
