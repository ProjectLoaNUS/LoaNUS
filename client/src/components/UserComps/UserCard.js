import styled from "styled-components";
import React from "react";
import { Card, CardContent, CardActions, Avatar } from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import ButtonComponent from "../Button";
import { useAuth } from "../../database/auth";
import { useState } from "react";
import { Buffer } from "buffer";

const StyledCard = styled(Card)`
  border-radius: 10px;
  height: 350px;
  width: 260px;
  box-shadow: 5px 10px #dce0e6;
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
`;
function Usercard(props) {
  const [image, setImage] = useState("");
  const userimage = props.user.image;
  console.log(userimage);

  /*async function binToImgUrl(image) {
    const bin = image.data;
    const ctype = image.contentType;
    const binary = Buffer.from(bin, "base64");
    const blob = new Blob([binary.buffer], {
      type: ctype,
    });
    const url = URL.createObjectURL(blob);
    return url;
  }
  let urlimage = binToImgUrl(userimage);
  setImage(urlimage);*/
  const handleClick = () => {};
  return (
    <StyledCard variant="outlined">
      <Avatar src={image} sx={{ width: 140, height: 140 }}>
        {props.user && !image
          ? props.user.name
            ? props.user.name[0]
            : "U"
          : ""}
      </Avatar>
      <StyledContent>
        <UserName>{props.user.name}</UserName>
        <Ratings>
          4.5
          <StarRateIcon></StarRateIcon>
        </Ratings>
      </StyledContent>
      <CardActions>
        <ButtonComponent
          state="primary"
          text="Follow"
          onClick={handleClick}
        ></ButtonComponent>
      </CardActions>
    </StyledCard>
  );
}

export default Usercard;
