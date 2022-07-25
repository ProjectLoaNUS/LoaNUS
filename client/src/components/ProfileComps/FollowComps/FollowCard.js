import styled from "styled-components";
import React, { useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import ButtonComponent from "../../../utils/Button";
import { useState } from "react";
import { useAuth } from "../../../database/auth";
import axios from "axios";
import { BACKEND_URL } from "../../../database/const";
import { Button, Skeleton, Stack } from "@mui/material";
import { getProfilePicUrl } from "../../../utils/getProfilePic";

const FollowItem = styled(ListItem)`
  margin-bottom: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  box-shadow: 5px 10px #dce0e6;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

function FollowCard(props) {
  const { id, activatebutton, username } = props;
  const { user } = useAuth();
  const [followed, setFollowed] = useState(props.followed);
  const [userPicUrl, setUserPicUrl] = useState("");

  const handleFollow = async (otherid) => {
    let friends = {
      follower: user.id,
      followed: otherid,
    };
    try {
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
    if (id) {
      getProfilePicUrl(id).then(url => {
        setUserPicUrl(url);
      });
    }
  }, [id]);

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

const CardsList = styled(Stack)`
  width: max(265px, 30%);
  min-height: 0%;
  max-height: 100%;
  padding-right: 6px;
  overflow-y: auto;
`;
export function LoadingFollowCards(props) {
  const { numOfCards } = props;

  return (
    <CardsList>
      {[...Array(numOfCards)].map((card, index) => {
        return <LoadingFollowCard key={index} />;
      })}
    </CardsList>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1ch;
  padding: 1ch;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  box-shadow: 5px 10px #dce0e6;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;
export function LoadingFollowCard() {
  return (
    <Container>
      <Skeleton variant="circular" sx={{ flex: "0 0 auto" }}>
        <Avatar />
      </Skeleton>
      <Skeleton variant="text" sx={{ flex: "1 1 auto" }} />
      <Skeleton
        variant="rectangular"
        sx={{ flex: "0 0 auto", borderRadius: "25px" }}
      >
        <Button>Follow</Button>
      </Skeleton>
    </Container>
  );
}
