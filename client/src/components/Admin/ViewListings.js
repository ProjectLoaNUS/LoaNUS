import styled from "styled-components";
import React from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { Card, Slide, Typography } from "@mui/material";
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
    const token = jwt.sign(
      {},
      JWT_SECRET,
      {expiresIn: JWT_EXPIRES_IN}
    );
    axios
      .get(`${BACKEND_URL}/api/items/getListingsImgs`, {
        headers: {
          "x-auth-token": token
        }
      })
      .then((res) => {
        if (res.status === 200) {
          setListingImgs(res.data.images);
        } else {
          console.log(res.data.error);
        }
      })
      .catch((err) => console.log(err, "error occured"));
    axios
      .get(`${BACKEND_URL}/api/items/getListingsTexts`, {
        headers: {
          "x-auth-token": token
        }
      })
      .then((res) => {
        if (res.status === 200) {
          setListingDetails(res.data.listings);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log(res.data.error);
        }
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
