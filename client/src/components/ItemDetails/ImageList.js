import { Card, Stack } from "@mui/material";
import styled from "styled-components";
import { theme } from "../Theme";

const ImageStack = styled(Stack)`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    align-self: stretch;
    height: 30vh;
    column-gap: 1ch;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 1ch;
    border: 1px solid ${theme.palette.primary.main};
    border-radius: 4px;
`;
const ImageCard = styled(Card)`
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    width: 30%;
    & .MuiCardActionArea-root {
        align-self: stretch;
        display: flex;
        flex-direction; column;
        min-height: 100%;
        align-items: stretch;
        justify-content: center;
        & .MuiCardMedia-root {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    & .MuiCardActions-root {
        align-self: stretch;
        display: flex;
        flex: 0 1 auto;
        flex-direction: row;
        justify-content: space-between;
    }
`;
const ImageDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1 1 0;
    min-height: 0;
    width: 40%;
    img {
        min-height: 0;
        object-fit: contain;
    }
`;

export default function ImageList(props) {
    const { imageUrls } = props;

    return (
        <ImageStack direction="row">
            { imageUrls.map((imageUrl, index) => {
                return (
                    <ImageDiv key={index}>
                        <img src={imageUrl} alt="Item image" />
                    </ImageDiv>
                );
            })}
        </ImageStack>
    );
}