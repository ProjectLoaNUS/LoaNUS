import { Avatar, Card, CardActions, CardHeader, CardMedia, IconButton, Typography } from "@mui/material";
import styled from "styled-components";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ListCard = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
    min-width: 10rem;
    max-width: 40%;
    height: 100%;
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
const ListingActions = styled(CardActions)`
    & .MuiTypography-root {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export default function ListingCard(props) {
    const { date, title, imagesUrl, userName } = props;

    return (
        <ListCard>
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
                <IconButton>
                    <FavoriteBorderIcon />
                </IconButton>
                <Typography align="center" variant="caption">{title}</Typography>
            </CardActions>
        </ListCard>
    );
}