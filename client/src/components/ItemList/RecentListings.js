import { Paper, Stack, Typography } from "@mui/material";
import styled from "styled-components";
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

export default function RecentListings(props) {
    const { imageUrls, setImageUrls, texts, setTexts } = props;

    return (
        <ListingsPaper>
            <Typography align="left" variant="h3">Recent listings</Typography>
            <ListingsStack direction="row">
                <ItemList imageUrls={imageUrls} setImageUrls={setImageUrls} texts={texts} setTexts={setTexts} />
            </ListingsStack>
        </ListingsPaper>
    );
}