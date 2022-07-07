import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../../UserComps/UserCard";

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

function UserDisplay(props) {
  return (
    <MainContainer>
      {props.users.map((user, index) => (
        <UserCard key={index} otheruser={user} />
      ))}
    </MainContainer>
  );
}

export default UserDisplay;
