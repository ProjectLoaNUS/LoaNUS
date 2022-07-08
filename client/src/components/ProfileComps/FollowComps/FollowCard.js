import styled from "styled-components";
import React, { useEffect } from "react";
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

const FollowItem = styled(ListItem)`
  margin-bottom: 10px;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 10px;
  box-shadow: 5px 10px #dce0e6;
  transition: box-shadow 300ms cubic-bezier(0.4,0,0.2,1) 0ms;
`;

function FollowCard(props) {
  const { id, activatebutton, image, username } = props;
  const { user } = useAuth();
  const [followed, setFollowed] = useState(props.followed);
  const [ userPicUrl, setUserPicUrl ] = useState("");
  
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

  useEffect(() => {
    if (image) {
      const bin = image.data;
      const ctype = image.contentType;
      const binary = Buffer.from(bin, "base64");
      const blob = new Blob([binary.buffer], {
        type: ctype,
      });
      setUserPicUrl(URL.createObjectURL(blob));
    }
  }, [image]);

  return (
    <FollowItem>
      <ListItemAvatar>
        <Avatar src={userPicUrl || null}></Avatar>
      </ListItemAvatar>
      <ListItemText primary={username || "User"} />
      {activatebutton ? (
        followed ? (
          <ButtonComponent
            state="primary"
            text="Unfollow"
            setWidth={"30%"}
            setHeight={"30%"}
            setFontsize={"0.5rem"}
            onClick={() => handleUnfollow(id)}
          ></ButtonComponent>
        ) : (
          <ButtonComponent
            state="primary"
            text="Follow"
            setWidth={"30%"}
            setHeight={"30%"}
            setFontsize={"0.5rem"}
            onClick={() => handleFollow(id)}
          ></ButtonComponent>
        )
      ) : null}
    </FollowItem>
  );
}

export default FollowCard;
