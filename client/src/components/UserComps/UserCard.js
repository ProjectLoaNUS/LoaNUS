import styled from "styled-components";
import React from "react";
import { Card, CardContent, CardActions, Avatar } from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import ButtonComponent from "../Button";
import { useAuth } from "../../database/auth";

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
function Usercard() {
  const { user, setUser } = useAuth();
  const handleClick = () => {};
  return (
    <StyledCard variant="outlined">
      <Avatar src={user && user.photoURL} sx={{ width: 140, height: 140 }}>
        {user && !user.photoURL
          ? user.displayName
            ? user.displayName[0]
            : "U"
          : ""}
      </Avatar>
      <StyledContent>
        <UserName>{user.displayName}</UserName>
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
