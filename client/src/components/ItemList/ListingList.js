import { Paper, Stack, Typography } from "@mui/material";
import styled from "styled-components";
import ListingCard from "./ListingCard";
import Loading from "../../assets/loading.svg";
import NoImage from "../../assets/no-image.png";
import { CATEGORIES } from "../NewItem/ItemCategories";

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

export default function ListingList(props) {
    const { imageUrls, setImageUrls, texts, setTexts } = props;

    return (
        <ListingsPaper>
            <Typography align="left" variant="h3">Recent listings</Typography>
            <ListingsStack direction="row">
                { texts ? (texts.map((text, index) => {
                    if (!text.borrowedBy) {
                        const date = new Date(text.date).toLocaleDateString({}, 
                                {year: 'numeric', month: 'short', day: 'numeric'});
                        const deadline = new Date(text.deadline).toLocaleDateString({}, 
                                {year: 'numeric', month: 'short', day: 'numeric'});
                        const category = CATEGORIES[text.category];

                        const removeItem = () => {
                            setTexts(prevTexts => {
                                return prevTexts.filter(other => other !== text);
                            });
                            setImageUrls(prevUrls => {
                                const thisUrl = prevUrls[index];
                                return prevUrls.filter(other => other !== thisUrl);
                            });
                        }

                        return (
                            <ListingCard
                                key={index}
                                itemId={text._id}
                                date={date}
                                imagesUrl={(imageUrls[index] !== undefined && (imageUrls[index]).length === 0) ? [NoImage] : (imageUrls[index] || [Loading])}
                                title={text.title}
                                userName={text.userName}
                                deadline={deadline}
                                category={category}
                                description={text.description}
                                location={text.location}
                                telegram={text.telegram}
                                removeItem={removeItem} />
                        );
                    }
                })) : 
                'Loading'}
            </ListingsStack>
        </ListingsPaper>
    );
}