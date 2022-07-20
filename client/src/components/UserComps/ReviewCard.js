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
      <ListItemText
        primary={"Rating:" + " " + review.rating}
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
      <ListItemText />
    </ListItem>
  );
}

export default ReviewCard;
