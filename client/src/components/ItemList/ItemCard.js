import { Avatar, Card, CardActionArea, CardActions, CardHeader, CardMedia, IconButton, Typography } from "@mui/material";
import styled from "styled-components";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from "react";
import DetailsDialog from "../ItemDetails/DetailsDialog";

const ListCard = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 0 0 auto;
    width: 30%;
    & .MuiCardHeader-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
const ListingActionArea = styled(CardActionArea)`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
    width: 100%;
`;
const ListingActions = styled(CardActions)`
    & .MuiTypography-root {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export default function ItemCard(props) {
    const { itemId, date, title, imagesUrl, userName, category, description, location, telegram, deadline, removeItem } = props;
    const [ open, setOpen ] = useState(false);

    const handleShowDetails = (event) => {
        setOpen(true);
    }

    const handleLike = (event) => {
        event.stopPropagation();
        event.preventDefault();
    }

    const handleMouseDown = (event) => {
        event.stopPropagation();
    }

    return (
        <ListCard>
            <ListingActionArea component="a" onClick={ handleShowDetails }>
                <CardHeader 
                avatar={
                    <Avatar>{userName.charAt(0)}</Avatar>
                }
                title={userName}
                subheader={date} />
                    <ImageDiv>
                        <CardMedia 
                        component="img"
                        image={imagesUrl[0]}
                        alt="Item request image" />
                    </ImageDiv>
                <CardActions>
                    <IconButton onClick={handleLike} onMouseDown={handleMouseDown}>
                        <FavoriteBorderIcon />
                    </IconButton>
                    <Typography align="center" variant="caption">{title}</Typography>
                </CardActions>
            </ListingActionArea>
            <DetailsDialog
                itemId={itemId}
                date={date}
                userName={userName}
                title={title}
                imageUrls={imagesUrl}
                category={category}
                description={description}
                location={location}
                telegram={telegram}
                deadline={deadline}
                open={open}
                setOpen={setOpen}
                removeItem={removeItem} />
        </ListCard>
    );
}