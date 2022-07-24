import styled from "styled-components";
import React from "react";
import axios from "axios";
import { Card, Slide, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";

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
const Listings = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: max(210px, 80%);
  flex: 1 1 auto;
`;

function ViewListings() {
  const [listingDetails, setListingDetails] = useState([]);
  const [listingImgs, setListingImgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/items/getListingsImgs`)
      .then((res) => {
        setListingImgs(res.data.images);
      })
      .catch((err) => console.log(err, "error occured"));
    axios
      .get(`${BACKEND_URL}/api/items/getListingsTexts`)
      .then((res) => {
        setListingDetails(res.data.listings);
        setIsLoading(false);
      })
      .catch((err) => console.log(err, "error occured"));
  }, []);
  return (
    <CreateCard>
      <Typography align="center" variant="h5" fontWeight="600" color="#eb8736">
        Remove inappropriate listings
      </Typography>
      <Listings>
        <ItemList
          isLoading={isLoading}
          noItemsText="No item listings yet. Create one?"
          itemImages={listingImgs}
          itemDatas={listingDetails}
          setItemDatas={setListingDetails}
        />
      </Listings>
    </CreateCard>
  );
}

export default ViewListings;
