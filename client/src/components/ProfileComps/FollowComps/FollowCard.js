import styled from "styled-components";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import ButtonComponent from "../../Button";
import { Buffer } from "buffer";
import { useState } from "react";
import { useAuth } from "../../../database/auth";
import axios from "axios";
import { BACKEND_URL } from "../../../database/const";

function FollowCard(props) {
  const { user } = useAuth();
  const [followed, setFollowed] = useState(props.followed);
  let userimage;
  let url;
  if (props.image) {
    userimage = props.image;
    const bin = userimage.data;
    const ctype = userimage.contentType;
    const binary = Buffer.from(bin, "base64");
    const blob = new Blob([binary.buffer], {
      type: ctype,
    });
    url = URL.createObjectURL(blob);
  }
  const handleFollow = async (otherid) => {
    let friends = {
      follower: user.id,
      followed: otherid,
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
  const handleUnfollow = async (otherid) => {
    let friends = {
      follower: user.id,
      unfollowed: otherid,
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
    <List>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={url || null}></Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.username || "User"} />
        {followed ? (
          <ButtonComponent
            state="primary"
            text="Unfollow"
            onClick={() => handleUnfollow(props.id)}
          ></ButtonComponent>
        ) : (
          <ButtonComponent
            state="primary"
            text="Follow"
            onClick={() => handleFollow(props.id)}
          ></ButtonComponent>
        )}
      </ListItem>
    </List>
  );
}

export default FollowCard;
