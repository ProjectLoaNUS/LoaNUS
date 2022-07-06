import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../database/auth";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";
import { Buffer } from 'buffer';

const PaddedGrid = styled(Grid)`
  height: 100%;
  width: 100%;
  padding: 1ch 1rem;
  margin-top: 0;
  overflow-y: auto;
`;
const ItemGrid = styled(Grid)`
  .MuiCard-root {
    height: 100%;
    width: 100%;
  }
`;

export default function Listings(props) {
    const { user } = useAuth();
    const [ listingTexts, setListingTexts ] = useState([]);
    const [ listingImgs, setListingImgs ] = useState([]);

    useEffect(() => {
      fetch(`${BACKEND_URL}/api/items/getListingsImgsOfUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id
        }),
      })
      .then(req => req.json())
      .then(data => {
        if (data.status === "ok") {
          setListingImgs(data.listingsImgs);
        }
      });
      fetch(`${BACKEND_URL}/api/items/getListingsTextsOfUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id
        }),
      })
      .then(req => req.json())
      .then(data => {
        if (data.status === "ok") {
          setListingTexts(data.listingsTexts);
        }
      });
    }, [user]);

    function ListingsGrid(props) {
        const { children } = props;
    
        return (
          <ItemGrid item alignItems="stretch" justifyContent="center" xl={4} xs={4}>
            {children}
          </ItemGrid>
        );
      }

    return (
      <PaddedGrid container spacing={1}>
        <ItemList
          CardContainer={ListingsGrid}
          itemImages={listingImgs}
          itemDatas={listingTexts}
          setItemDatas={setListingTexts} />
      </PaddedGrid>
    );
}