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
  const { users } = props;

  return (
    <MainContainer>
      {users ? 
        users.length ?
          users.map((user, index) => (
            <UserCard key={index} otheruser={user} />
          ))
        : "No such user"
      : 
        ""
      }
    </MainContainer>
  );
}

export default UserDisplay;
