import styled from "styled-components";
import React from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../utils/jwt-config";

const CreateCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: max(80%, 300px);
  align-self: center;
  padding: 0.5em;
  gap: 1em;
`;
const Requests = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: max(210px, 80%);
  flex: 1 1 auto;
`;
const MainContainer = styled.div`
  min-height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  & .MuiTabs-root {
    flex: 0 0 auto;
  }
  & .MuiContainer-root {
    padding: 0;

    & .MuiBox-root {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      height: 100%;
      padding: 0;
    }
  }
`;
const RequestsGrid = styled.div`
  --grid-layout-gap: 1ch;
  --grid-column-count: 4;
  --grid-item--min-width: 210px;

  --gap-count: calc(var(--grid-column-count) - 1);
  --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
  --grid-item--max-width: calc(
    (100% - var(--total-gap-width)) / var(--grid-column-count)
  );
  --grid-item-width: max(
    var(--grid-item--min-width),
    var(--grid-item--max-width)
  );

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-item-width), 1fr));
  grid-auto-rows: calc(var(--grid-item-width) * 2 / 3);
  grid-gap: var(--grid-layout-gap);
  align-items: stretch;
  justify-items: stretch;
  padding: 1ch;
  height: 100%;
  overflow-y: auto;
`;

function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = jwt.sign(
      {},
      JWT_SECRET,
      {expiresIn: JWT_EXPIRES_IN}
    );
    axios.get(`${BACKEND_URL}/api/items/getRequests`, {
      headers: {
        "x-auth-token": token
      }
    }).then((req) => {
      if (req.status === 200) {
        setRequests(req.data.requests);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.log(req.data.error);
      }
    });
  }, []);

  return (
    <CreateCard>
      <Typography align="center" variant="h5" fontWeight="600" color="#eb8736">
        Remove inappropriate requests
      </Typography>

      <Requests>
        <ItemList
          ListContaier={RequestsGrid}
          isLoading={isLoading}
          buttonText="Delete request"
          isOwnerButtonText="Delete request"
          noItemsText="No item requests yet. Create one?"
          itemDatas={requests}
          setItemDatas={setRequests}
        />
      </Requests>
    </CreateCard>
  );
}

export default ViewRequests;
