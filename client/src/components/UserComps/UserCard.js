import styled from "styled-components";
import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Dialog,
  Grow,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  DialogContentText,
  Rating,
} from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import ButtonComponent from "../../utils/Button";
import { useAuth } from "../../database/auth";
import { useState, useEffect, forwardRef } from "react";
import { Buffer } from "buffer";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";
import ReviewList from "./ReviewList";

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
  const [following, setFollowing] = useState([]);
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
      if (userimage.data && userimage.contentType) {
        const bin = userimage.data;
        const ctype = userimage.contentType;
        const binary = Buffer.from(bin, "base64");
        const blob = new Blob([binary.buffer], {
          type: ctype,
        });
        setProfilePicUrl(URL.createObjectURL(blob));
      } else if (userimage.url) {
        setProfilePicUrl(userimage.url);
      }
    }
  }, [props.otheruser]);

  useEffect(() => {
    if (props.otheruser._id) {
      try {
        axios
          .get(
            `${BACKEND_URL}/api/user/getrating?userId=` + props.otheruser._id
          )
          .then((res) => setGetRating(res.data.rating));

        axios
          .get(`${BACKEND_URL}/api/follow/getfollowingid?userId=` + user.id)
          .then((res) => setFollowing(res.data));
      } catch (error) {
        console.log(error);
      }
    }
  }, [props.otheruser, user]);

  useEffect(() => {
    if (props.otheruser._id && following.includes(props.otheruser._id)) {
      setFollowed(true);
    }
  }, [following, props.otheruser._id]);

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
      userName: user.displayName,
      otheruserId: otheruser._id,
      otheruserName: otheruser.name,
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
  return (
    <StyledCard variant="outlined">
      <Avatar src={profilePicUrl} sx={{ width: 140, height: 140 }}>
        {props.otheruser && !profilePicUrl
          ? props.otheruser.name
            ? props.otheruser.name[0]
            : "U"
          : ""}
      </Avatar>
      <StyledContent>
        <UserName>{props.otheruser.name}</UserName>
        <Ratings>
          {Math.round(getrating * 10) / 10}
          <StyledIcon></StyledIcon>
        </Ratings>
      </StyledContent>
      <CardActions>
        {followed ? (
          <ButtonComponent
            state="primary"
            text="Unfollow"
            size="small"
            onClick={() => handleUnfollow(props.otheruser)}
          ></ButtonComponent>
        ) : (
          <ButtonComponent
            state="primary"
            text="Follow"
            size="small"
            onClick={() => handleFollow(props.otheruser)}
          ></ButtonComponent>
        )}
        <ButtonComponent
          text="review"
          size="small"
          onClick={handleOpen}
        ></ButtonComponent>
      </CardActions>

      <StyledDialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <ReviewList userid={props.otheruser._id}></ReviewList>
        <DialogTitle style={{ fontWeight: 650, color: "#2d3c4a" }}>
          Review
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Leave a review for {props.otheruser.name}!
          </DialogContentText>
          <StyledRating
            name="size-medium"
            precision={0.5}
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
