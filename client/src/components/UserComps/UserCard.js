import styled from "styled-components";
import React from "react";
import { Card, CardContent, CardActions, Avatar } from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import ButtonComponent from "../Button";
import { useAuth } from "../../database/auth";
import { useState, useEffect } from "react";
import { Buffer } from "buffer";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";

const StyledCard = styled(Card)`
  border-radius: 10px;
  height: 350px;
  width: 260px;
  box-shadow: 5px 10px #dce0e6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const StyledContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h3``;
const Ratings = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
function Usercard(props) {
  const { user } = useAuth();
  const [followed, setFollowed] = useState(false);

  let userimage;
  let url;
  if (props.otheruser.image) {
    userimage = props.otheruser.image;
    const bin = userimage.data;
    const ctype = userimage.contentType;
    const binary = Buffer.from(bin, "base64");
    const blob = new Blob([binary.buffer], {
      type: ctype,
    });
    url = URL.createObjectURL(blob);
  }

  /* function binToImgUrl(image) {
    const bin = image.data;
    const ctype = image.contentType;
    const binary = Buffer.from(bin, "base64");
    const blob = new Blob([binary.buffer], {
      type: ctype,
    });
    const url = URL.createObjectURL(blob);
    return url;
  }
  let urlimage = binToImgUrl(userimage);*/

  const handleFollow = async (otheruser) => {
    let friends = {
      follower: user.id,
      followed: otheruser._id,
    };
    try {
      console.log(friends);
      axios
        .post(`${BACKEND_URL}/api/follow/followuser`, friends)
        .then((res) => {
          setFollowed(true);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const handleUnfollow = async (otheruser) => {
    let friends = {
      follower: user.id,
      unfollowed: otheruser._id,
    };
    try {
      console.log(friends);
      axios
        .post(`${BACKEND_URL}/api/follow/unfollowuser`, friends)
        .then((res) => {
          setFollowed(false);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <StyledCard variant="outlined">
      <Avatar src={url || null} sx={{ width: 140, height: 140 }}>
        {props.otheruser && !url
          ? props.otheruser.name
            ? props.otheruser.name[0]
            : "U"
          : ""}
      </Avatar>
      <StyledContent>
        <UserName>{props.otheruser.name}</UserName>
        <Ratings>
          4.5
          <StarRateIcon></StarRateIcon>
        </Ratings>
      </StyledContent>
      <CardActions>
        {followed ? (
          <ButtonComponent
            state="primary"
            text="Unfollow"
            onClick={() => handleUnfollow(props.otheruser)}
          ></ButtonComponent>
        ) : (
          <ButtonComponent
            state="primary"
            text="Follow"
            onClick={() => handleFollow(props.otheruser)}
          ></ButtonComponent>
        )}
      </CardActions>
    </StyledCard>
  );
}

export default Usercard;