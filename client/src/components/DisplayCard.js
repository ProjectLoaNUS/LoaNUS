import React from "react";
import styled from "styled-components";
import { Card } from "@mui/material";
import { CardMedia } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardHeader } from "@mui/material";

const CardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
`;

export default function ItemCard(props) {
  return (
    <CardContainer>
      <CardHeader title={props.title}></CardHeader>
      <CardMedia component="img" image={props.image}></CardMedia>
      <CardContent>{props.description}</CardContent>
    </CardContainer>
  );
}
