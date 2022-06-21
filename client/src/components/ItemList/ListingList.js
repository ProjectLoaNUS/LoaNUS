import { Paper, Stack, Typography } from "@mui/material";
import styled from "styled-components";
import ListingCard from "./ListingCard";
import Loading from "../../assets/loading.svg";
import NoImage from "../../assets/no-image.png";

const ListingsStack = styled(Stack)`
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    flex: 1 1 auto;
    overflow-x: auto;
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

export default function ListingList(props) {
    const { imageUrls, texts } = props;

    return (
        <ListingsPaper>
            <Typography align="left" variant="h3">Recent listings</Typography>
            <ListingsStack direction="row">
                { texts ? (texts.map((text, index) => {
                    const date = new Date(text.date).toLocaleDateString({}, 
                            {year: 'numeric', month: 'short', day: 'numeric'});
                    const title = text.title;
                    const userName = text.userName;

                    function LoadingDisplay() {
                        return (
                            <img src={ Loading } />
                        );
                    }

                    return (
                        <ListingCard
                          key={index}
                          date={date}
                          imagesUrl={(imageUrls[index] !== undefined && (imageUrls[index]).length === 0) ? [NoImage] : (imageUrls[index] || [Loading])}
                          title={title}
                          userName={userName} />
                    );
                })) : 
                'Loading'}
            </ListingsStack>
        </ListingsPaper>
    );
}