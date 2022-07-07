import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../../UserComps/UserCard";
import { Typography } from "@mui/material";

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;
const StyledTypo = styled(Typography)`
  padding: 1em 0;
  width: 100%;
`;

function UserDisplay(props) {
  const { queryText, users } = props;

  return (
    <MainContainer>
      {users ? 
        users.length ?
          users.map((user, index) => (
            <UserCard key={index} otheruser={user} />
          ))
        : <StyledTypo align="center" variant="subtitle1">No user named "{queryText}"</StyledTypo>
      : 
        ""
      }
    </MainContainer>
  );
}

export default UserDisplay;
