import React, { useEffect } from "react";
import styled from "styled-components";
import { Avatar, Button, Rating, Snackbar, Typography } from "@mui/material";
import { useAuth } from "../../database/auth";
import { useState } from "react";
import ButtonComponent from "../Button";
import axios from "axios";
import { Buffer } from "buffer";
import { BACKEND_URL } from "../../database/const";
import { format } from "timeago.js";

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
  align-items: center;
  justify-content: space-evenly;
`;

const HiddenInput = styled.input`
  display: none;
`;
const StyledRating = styled(Rating)`
  color: #eb8736;
`;

function AvatarCard(props) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [profileimage, setProfileImage] = useState();
  const [rating, setRating] = useState(null);
  const { user, setUser } = useAuth();

  const hiddenFileInput = React.useRef(null);

  useEffect(() => {
    if (user) {
      if (!user.photoURL && user.photodata && user.photoformat) {
        const binary = Buffer.from(user.photodata);
        const blob = new Blob([binary.buffer], { type: user.photoformat });
        setUser((prevUser) => {
          let newUser = structuredClone(prevUser);
          newUser.photoURL = URL.createObjectURL(blob);

          return newUser;
        });
      }
    }
  }, [user, setUser]);
  useEffect(() => {
    if (user) {
      try {
        axios
          .get(`${BACKEND_URL}/api/user/getrating?userId=` + user.id)
          .then((res) => setRating(res.data.rating));
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };
  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  const handleSubmit = async () => {
    if (!profileimage) {
      setAlertMessage("Please select an image first!");
      setShowAlert(true);
    } else {
      profileimage.arrayBuffer().then((rawBuffer) => {
        const buffer = Buffer.from(rawBuffer);
        let newUser = structuredClone(user);
        newUser.photodata = buffer;
        newUser.photoformat = profileimage.type;
        delete newUser.photourl;
        localStorage.setItem("user", JSON.stringify(newUser));
        const blob = new Blob([buffer], { type: profileimage.type });
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
    }
  };

  const handleFileSubmitChange = (event) => {
    const fileUploaded = event.target.files[0];
    setProfileImage(fileUploaded);
  };
  return (
    <MainContainer>
      <Avatar src={user && user.photoURL} sx={{ width: 120, height: 120 }}>
        {user && !user.photoURL
          ? user.displayName
            ? user.displayName[0]
            : "U"
          : ""}
      </Avatar>
      <UserName>{user && user.displayName}</UserName>
      <Email>{user && user.email}</Email>
      <StyledRating value={rating} precision={0.1} readOnly />
      <LocationDateContainer>
        Singapore, Joined {format(user?.createdat)}{" "}
      </LocationDateContainer>
      <FollowContainer>
        {user?.followers ? user?.followers.length : 0} Followers{" "}
        {user?.following ? user?.following.length : 0} Following
      </FollowContainer>
      <ImageUploadContainer>
        <ButtonComponent
          text={"Set picture"}
          size={"small"}
          state={"primary"}
          setWidth={"30%"}
          setFontsize={"0.45rem"}
          onClick={handleClick}
        ></ButtonComponent>
        <ButtonComponent
          text={"Upload Image"}
          size={"small"}
          setWidth={"30%"}
          onClick={handleSubmit}
          setFontsize={"0.45rem"}
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
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            event.preventDefault();
          }
          handleCloseAlert(event);
        }}
        message={alertMessage}
        action={
          <Button color="secondary" size="small" onClick={handleCloseAlert}>
            DISMISS
          </Button>
        }
      />
    </MainContainer>
  );
}
export default AvatarCard;
