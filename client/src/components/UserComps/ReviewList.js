import styled from "styled-components";
import React from "react";
import { useState, useEffect } from "react";
import { List } from "@mui/material";
import { BACKEND_URL } from "../../database/const";
import axios from "axios";
import ReviewCard from "./ReviewCard";

function ReviewList({ otheruser }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/user/getreviews?userId=` + otheruser._id)
      .then((res) => setReviews(res.data.reviews));
  });
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
