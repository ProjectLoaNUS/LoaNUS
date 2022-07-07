import React, { useEffect } from "react";
import styled from "styled-components";
import { Avatar, Rating, Typography } from "@mui/material";
import { useAuth } from "../../database/auth";
import { useState } from "react";
import ButtonComponent from "../Button";
import axios from "axios";
import { Buffer } from "buffer";
import { BACKEND_URL } from "../../database/const";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 50vh;
`;

const UserName = styled.h1`
  color: black;
`;
const Email = styled(Typography)`
  color: grey;
`;
const LocationDateContainer = styled.div`
  display: flex;
  flex-direction: row;
  color: #2d3c4a;
`;

const FollowContainer = styled.div`
  display: flex;
  flex-direction: row;
  color: #2d3c4a;
`;
const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 20px;
`;

const HiddenInput = styled.input`
  display: none;
`;

function AvatarCard(props) {
  const [profileimage, setProfileImage] = useState();
  const { user, setUser } = useAuth();
  const hiddenFileInput = React.useRef(null);

  useEffect(() => {
    if (user) {
      if (!user.photoURL && (user.photodata && user.photoformat)) {
        const binary = Buffer.from(user.photodata);
        const blob = new Blob([binary.buffer], { type: user.photoformat });
        setUser(prevUser => {
          let newUser = structuredClone(prevUser);
          newUser.photoURL = URL.createObjectURL(blob);
          return newUser;
        })
      }
    }
  }, [user, setUser]);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  const handleSubmit = async () => {
    profileimage.arrayBuffer().then(rawBuffer => {
      const buffer = Buffer.from(rawBuffer);
      let newUser = structuredClone(user);
      newUser.photodata = buffer;
      newUser.photoformat = profileimage.type;
      delete newUser.photourl;
      localStorage.setItem("user", JSON.stringify(newUser));
      const blob = new Blob([buffer], {type: profileimage.type});
      newUser.photoURL = URL.createObjectURL(blob);
      setUser(newUser);
    });
    
    let formData = new FormData();
    formData.append("userId", user.id);
    formData.append("image", profileimage);
    axios
      .post(`${BACKEND_URL}/api/user/setProfilePic`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileSubmitChange = (event) => {
    const fileUploaded = event.target.files[0];
    setProfileImage(fileUploaded);
  };

  return (
    <MainContainer>
      <Avatar src={user && user.photoURL} sx={{ width: 120, height: 120 }}>
        {(user && !user.photoURL) ? (user.displayName ? user.displayName[0] : 'U') : "" }
      </Avatar>
      <UserName>{user.displayName}</UserName>
      <Email>{user.email}</Email>
      <Rating name="size-medium" defaultValue={3} />
      <LocationDateContainer>Singapore, Joined 2y </LocationDateContainer>
      <FollowContainer>10 Followers 5 Following</FollowContainer>
      <ImageUploadContainer>
        <ButtonComponent
          text={"Set picture"}
          size={"small"}
          state={"primary"}
          onClick={handleClick}
        ></ButtonComponent>
        <ButtonComponent
          text={"Upload Image"}
          size={"small"}
          onClick={handleSubmit}
        ></ButtonComponent>
      </ImageUploadContainer>

      <HiddenInput
        type="file"
        id="choose-image"
        name="image"
        accept="image/gif,image/jpeg,image/png,image/svg+xml"
        ref={hiddenFileInput}
        onChange={handleFileSubmitChange}
      />
    </MainContainer>
  );
}
export default AvatarCard;
