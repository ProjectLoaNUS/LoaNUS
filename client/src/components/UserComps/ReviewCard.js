import React from "react";
import { useState, useEffect } from "react";
import {
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Typography,
  Avatar,
} from "@mui/material";
import { BACKEND_URL } from "../../database/const";
import axios from "axios";
import { Buffer } from "buffer";
import StarRateIcon from "@mui/icons-material/StarRate";
import styled from "styled-components";

const ListTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  margin-top: 1vh;
`;
const RatingDisplay = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 2vh;
`;
const Rating = styled.h4`
  height: auto;
`;
const StyledIcon = styled(StarRateIcon)`
  color: #eb8736;
  transform: scale(0.75);
`;

function ReviewCard({ review }) {
  const [profilePicUrl, setProfilePicUrl] = useState("");
  useEffect(() => {
    let data = {
      userId: review.reviewer,
    };
    try {
      axios.post(`${BACKEND_URL}/api/user/getProfilePic`, data).then((res) => {
        if (res.data.image) {
          const userimage = res.data.image;
          const bin = userimage.data;
          const ctype = userimage.contentType;
          const binary = Buffer.from(bin, "base64");
          const blob = new Blob([binary.buffer], {
            type: ctype,
          });
          setProfilePicUrl(URL.createObjectURL(blob));
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
  console.log(profilePicUrl);
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="User Image" src={profilePicUrl} />
      </ListItemAvatar>
      <ListTextContainer>
        <RatingDisplay>
          <Rating>{review.rating}</Rating>
          <StyledIcon></StyledIcon>
        </RatingDisplay>
        <ListItemText
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {review.reviewerName}
              </Typography>
              {" — " + review.comments}
            </React.Fragment>
          }
        />
      </ListTextContainer>
    </ListItem>
  );
}

export default ReviewCard;
