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
const UsersGrid = styled.div`
  --grid-layout-gap: 1em;
  --grid-column-count: 4;
  --grid-item--min-width: 200px;
  --gap-count: calc(var(--grid-column-count) - 1);
  --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
  --grid-item--max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));
  --grid-item-width: max(var(--grid-item--min-width), var(--grid-item--max-width));
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-item-width), 1fr));
  grid-auto-rows: calc(var(--grid-item-width) * 7 / 4);
  grid-gap: var(--grid-layout-gap);
  align-items: stretch;
  justify-items: stretch;
  padding: 1em;
  height: 100%;
  overflow-y: auto;
  flex: 1 1 auto;
`;
const NoItemsTypo = styled(Typography)`
  padding: 1rem 0;
`;
const StyledTypo = styled(Typography)`
  padding: 1em 0;
  width: 100%;
`;

function UserDisplay(props) {
  const { queryText, users } = props;

  function Users(props) {
    const {users} = props;

    return (
      <>
        {
          users.map((user, index) => (
            <UserCard key={index} otheruser={user} />
          ))
        }
      </>
    )
  }

  return (
    <>
      {users ? 
        users.length ?
          <UsersGrid><Users users={users} /></UsersGrid>
        : <StyledTypo align="center" variant="subtitle1">No user named "{queryText}"</StyledTypo>
      : 
        ""
      }
    </>
  );
}

export default UserDisplay;
