import { Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";
import ItemList from "./ItemList";

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
            <Typography align="left" variant="h4">Recent listings</Typography>
            <ItemList
                ListContainer={ListingsGrid}
                isLoading={isLoading}
                noItemsText="No items listed by anyone yet. You can start by listing one of your items!"
                itemImages={listingImgs}
                itemDatas={listingDetails}
                setItemDatas={setListingDetails} />
        </ListingsPaper>
    );
}