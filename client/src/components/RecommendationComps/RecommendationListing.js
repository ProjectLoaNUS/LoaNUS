import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import jwt from 'jsonwebtoken';
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";
import { useAuth } from "../../database/auth";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../utils/jwt-config";

const ListingsGrid = styled.div`
  flex: 1 1 auto;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max(240px, 25%);
  grid-gap: 1ch;
  justify-items: stretch;
  padding: 1ch;
  overflow-x: auto;
`;
const ListingsPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  gap: 1ch;
  align-items: stretch;
  justify-content: space-between;
  padding: 1rem;
  width: 93vw;
  height: 40vh;
  border-color: 2px black solid;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
`;

export default function RecommendationListings() {
  const [listingDetails, setListingDetails] = useState([]);
  const [listingImgs, setListingImgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommended, setRecommended] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const token = jwt.sign(
      {},
      JWT_SECRET,
      {expiresIn: JWT_EXPIRES_IN}
    );
    const getcategory = async () => {
      const userToken = jwt.sign(
        {id: user.id},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
      );
      await axios
        .get(`${BACKEND_URL}/api/user/getrecommendation`, {
          headers: {
            "x-auth-token": userToken,
            "Content-Type": "application/json"
          }
        })
        .then((res) => {
          if (res.status === 200) {
            setRecommended(res.data.recommended);
          } else {
            console.log(res.data.error);
          }
        });
    };
    const getrecommendation = async () => {
      axios
        .get(
          `${BACKEND_URL}/api/items/getRecommendationImgs?category=` +
            recommended,
          {
            headers: {
              "x-auth-token": token,
              "Content-Type": "application/json"
            }
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setListingImgs(res.data.images);
          } else {
            console.log(res.data.error);
          }
        })
        .catch((err) => console.log(err, "error occured"));
      axios
        .get(
          `${BACKEND_URL}/api/items/getRecommendationTexts?category=` +
            recommended,
          {
            headers: {
              "x-auth-token": token,
              "Content-Type": "application/json"
            }
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setListingDetails(res.data.listings);
          } else {
            console.log(res.data.error);
          }
          setIsLoading(false);
        })
        .catch((err) => console.log(err, "error occured"));
    };
    if (user) {
      getcategory();
      getrecommendation();
    }
  }, [recommended, user]);

  return (
    <>
      {user ? (
        <ListingsPaper>
          <Typography align="left" variant="h4" color="#eb8736">
            Recommendation for you
          </Typography>
          <Box flex="1 1 auto" display="flex" flexDirection="column">
            <ItemList
              ListContainer={ListingsGrid}
              isLoading={isLoading}
              buttonText="Borrow it"
              noItemsText="No recommendations yet, view some items!"
              itemImages={listingImgs}
              itemDatas={listingDetails}
              setItemDatas={setListingDetails}
            />
          </Box>
        </ListingsPaper>
      ) : (
        <ListingsPaper>
          <Typography align="left" variant="h4" color="#eb8736">
            Log in to see recommendation
          </Typography>
        </ListingsPaper>
      )}
    </>
  );
}
