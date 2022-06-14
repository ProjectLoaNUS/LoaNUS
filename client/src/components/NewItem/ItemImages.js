import { Card, CardActionArea, CardActions, CardMedia, IconButton, Stack } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import styled from "styled-components";
import { useRef } from "react";
import { theme } from "../Theme";

const HiddenInput = styled.input`
    display: none;
`;
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
    width: 100%;
    img {
        min-height: 0;
        object-fit: contain;
    }
`;

export default function ItemImages(props) {
    const { images, setImages } = props;
    const chosenImg = useRef(null);
    const maxNumOfImages = 6;

    const handleChooseImg = () => {
        chosenImg.current.click();
    }

    const onImgChosen = (event) => {
        const url = URL.createObjectURL(event.target.files[0]);
        setImages([...images, url]);
    }

    return (
        <ImageStack direction="row">
            { images.map((image, index) => {
                return (
                    <ImageCard key={index}>
                        <ImageDiv>
                            <CardMedia 
                                component="img"
                                image={image}
                                alt="Item image" />
                        </ImageDiv>
                        <CardActions>
                            <IconButton size="small"><ArrowLeftIcon /></IconButton>
                            <IconButton size="small"><DeleteIcon /></IconButton>
                            <IconButton size="small"><ArrowRightIcon /></IconButton>
                        </CardActions>
                    </ImageCard>
                );
            })}
            { (images.length < maxNumOfImages) &&
                <ImageCard>
                    <CardActionArea onClick={handleChooseImg}>
                        <CardMedia>
                            <AddCircleIcon />
                        </CardMedia>
                    </CardActionArea>
                </ImageCard>
            }
            <HiddenInput type="file" id="choose-image" accept="image/gif,image/jpeg,image/png,image/svg+xml" onChange={onImgChosen} ref={chosenImg} /> 
        </ImageStack>
    );
}