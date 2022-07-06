import { Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";
import ItemList from "./ItemList";

const ListingsStack = styled(Stack)`
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    flex: 1 1 auto;
    overflow-x: auto;
    column-gap: 1ch;
    padding: 1ch;
`;
const ListingsPaper = styled(Paper)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    justify-content: center;
    padding: 1rem;
    width: 85vw;
    height: 40vh;
`;

export default function RecentListings() {
    const [ listingDetails, setListingDetails ] = useState([]);
    const [ listingImgs, setListingImgs ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);

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
        <ListingsPaper>
            <Typography align="left" variant="h3">Recent listings</Typography>
            <ListingsStack direction="row">
                <ItemList
                  isLoading={isLoading}
                  noItemsText="No items listed by anyone yet. You can start by listing one of your items!"
                  itemImages={listingImgs}
                  itemDatas={listingDetails}
                  setItemDatas={setListingDetails} />
            </ListingsStack>
        </ListingsPaper>
    );
}