import React from "react";
import styled from "styled-components";
import { Card } from "@mui/material";
import { CardMedia } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardHeader } from "@mui/material";

const CardContainer = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  alignSelf: "center",
  '& .MuiCardMedia-root': {
    height: "35vh"
  }
}));

export default function ItemCard(props) {
  return (
    <CardContainer>
      <CardHeader title={props.title}></CardHeader>
      <CardMedia component={props.component} height="auto"></CardMedia>
      <CardContent>{props.description}</CardContent>
    </CardContainer>
  );
}
