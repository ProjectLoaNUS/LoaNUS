import { Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";
import ItemList from "../ItemList/ItemList";
import { useAuth } from "../../database/auth";

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
  width: 85vw;
  height: 40vh;
`;

export default function RecommendationListings() {
  const [listingDetails, setListingDetails] = useState([]);
  const [listingImgs, setListingImgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommended, setRecommended] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const getcategory = async () => {
      await axios
        .get(`${BACKEND_URL}/api/user/getrecommendation?userid=` + user?.id)
        .then((res) => setRecommended(res.data.recommended));
      console.log(recommended);
    };
    const getrecommendation = async () => {
      axios
        .get(
          `${BACKEND_URL}/api/items/getRecommendationImgs?category=` +
            recommended
        )
        .then((res) => {
          setListingImgs(res.data.images);
        })
        .catch((err) => console.log(err, "error occured"));
      axios
        .get(
          `${BACKEND_URL}/api/items/getRecommendationTexts?category=` +
            recommended
        )
        .then((res) => {
          setListingDetails(res.data.listings);
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
          <Typography align="left" variant="h4">
            For you
          </Typography>
          <ItemList
            ListContainer={ListingsGrid}
            isLoading={isLoading}
            noItemsText="No recommendations yet, view some items!"
            itemImages={listingImgs}
            itemDatas={listingDetails}
            setItemDatas={setListingDetails}
          />
        </ListingsPaper>
      ) : (
        <ListingsPaper>
          <Typography align="left" variant="h4">
            Log in to see recommendation
          </Typography>
        </ListingsPaper>
      )}
    </>
  );
}
