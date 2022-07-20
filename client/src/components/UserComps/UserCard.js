import styled from "styled-components";
import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  Avatar,
  Dialog,
  Grow,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
  DialogContentText,
  Rating,
} from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import ButtonComponent from "../Button";
import { useAuth } from "../../database/auth";
import { useState, useEffect, forwardRef } from "react";
import { Buffer } from "buffer";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";

const ActionArea = styled(CardActionArea)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const StyledCard = styled(Card)`
  border-radius: 10px;
  box-shadow: 5px 10px #dce0e6;
  margin-right: 5px;
  margin-bottom: 10px;
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
  font-size: larger;
  font-weight: 600;
`;
const StyledIcon = styled(StarRateIcon)`
  color: #eb8736;
  padding-bottom: 5px;
`;

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    overflow-y: hidden;
  }
`;
const GrowUp = styled(Grow)`
  transform-origin: bottom center;
`;
const Transition = forwardRef(function Transition(props, ref) {
  return <GrowUp ref={ref} {...props} />;
});
const StyledRating = styled(Rating)`
  color: #eb8736;
`;
function UserCard(props) {
  const { user } = useAuth();
  const [followed, setFollowed] = useState(false);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(null);
  const [getrating, setGetRating] = useState(null);
  const [review, setReview] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (props.otheruser.image) {
      const userimage = props.otheruser.image;
      const bin = userimage.data;
      const ctype = userimage.contentType;
      const binary = Buffer.from(bin, "base64");
      const blob = new Blob([binary.buffer], {
        type: ctype,
      });
      setProfilePicUrl(URL.createObjectURL(blob));
    }
  }, [props.otheruser]);
  useEffect(() => {
    if (props.otheruser._id) {
      try {
        axios
          .get(
            `${BACKEND_URL}/api/user/getrating?userid=` + props.otheruser._id
          )
          .then((res) => setGetRating(res.data.rating));
      } catch (error) {
        console.log(error);
      }
    }
  }, [props.otheruser]);

  const handleFollow = async (otheruser) => {
    let friends = {
      follower: user.id,
      followed: otheruser._id,
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
  const handleUnfollow = async (otheruser) => {
    let friends = {
      follower: user.id,
      unfollowed: otheruser._id,
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
  const handleCreate = async (otheruser) => {
    let data = {
      userId: user.id,
      otheruserId: otheruser._id,
      rating: rating,
      comments: review,
    };
    try {
      await axios.post(`${BACKEND_URL}/api/user/createreview`, data);
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(open);
  console.log(rating);
  console.log(review);
  return (
    <StyledCard variant="outlined">
      <ActionArea onClick={handleOpen}>
        <Avatar src={profilePicUrl || null} sx={{ width: 140, height: 140 }}>
          {props.otheruser && !profilePicUrl
            ? props.otheruser.name
              ? props.otheruser.name[0]
              : "U"
            : ""}
        </Avatar>
        <StyledContent>
          <UserName>{props.otheruser.name}</UserName>
          <Ratings>
            {getrating}
            <StyledIcon></StyledIcon>
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
      </ActionArea>
      <StyledDialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Leave a review for {props.otheruser.name}!
          </DialogContentText>
          <StyledRating
            name="size-medium"
            defaultValue={0}
            value={rating}
            onChange={(event, newRating) => {
              setRating(newRating);
            }}
          ></StyledRating>
          <TextField
            autoFocus
            margin="dense"
            id="review"
            label="Comments"
            type="input"
            fullWidth
            variant="standard"
            onChange={(event) => setReview(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <ButtonComponent onClick={handleClose} text="CANCEL" size="small" />
          <ButtonComponent
            onClick={() => handleCreate(props.otheruser)}
            text="CREATE"
            state="primary"
            size="small"
          />
        </DialogActions>
      </StyledDialog>
    </StyledCard>
  );
}

export default UserCard;
