import React from "react";
import { useState, useEffect } from "react";
import { List } from "@mui/material";
import { BACKEND_URL } from "../../database/const";
import axios from "axios";
import jwt from "jsonwebtoken";
import ReviewCard from "./ReviewCard";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../utils/jwt-config";

function ReviewList({ userid }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (userid) {
      const token = jwt.sign(
        {id: userid},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
      );
      axios
        .get(`${BACKEND_URL}/api/user/getreviews`, {
          headers: {
            "x-auth-token": token
          }
        })
        .then((res) => setReviews(res.data.reviews));
    }
  }, [userid]);
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        overflow: "auto",
        maxHeight: 300,
      }}
    >
      {reviews.map((review, index) => (
        <ReviewCard key={index} review={review} />
      ))}
    </List>
  );
}

export default ReviewList;
