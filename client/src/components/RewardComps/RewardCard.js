import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useState } from "react";
import {
  borrowAction,
  deleteListingAction,
  isUserListingRelated,
} from "../ItemDetails/detailsDialogActions";
import { useAuth } from "../../database/auth";
import { Buffer } from "buffer";
import NoImage from "../../assets/no-image.png";
import { CATEGORIES } from "../NewItem/ItemCategories";
import { BACKEND_URL } from "../../database/const";
import RewardsDialog from "./RewardsDialog";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

const ListCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 25%;
  height: 100%;
  margin-right: 10px;
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
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;
const StyledCoin = styled(CurrencyExchangeIcon)`
  color: #2d3c4a;
  margin-right: 10px;
  transform: scale(1);
  margin-left: 5px;
`;
const CoinsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export default function RewardCard(props) {
  const { itemDetails, buttonText, onActionDone, onClickAction } = props;
  const [open, setOpen] = useState(false);

  const binary = Buffer.from(itemDetails.image.data.data);
  const blob = new Blob([binary.buffer], {
    type: itemDetails.image.contentType,
  });
  const url = URL.createObjectURL(blob);
  let processedurl = [];
  processedurl.push(url);

  const { user, setUser } = useAuth();

  const itemId = itemDetails._id;
  const deadline = new Date(itemDetails.deadline).toLocaleDateString(
    {},
    { year: "numeric", month: "short", day: "numeric" }
  );
  const category = itemDetails.category;
  const title = itemDetails.title;
  const description = itemDetails.description;
  const points = itemDetails.points;

  const handleShowDetails = (event) => {
    setOpen(true);
  };

  const handleLike = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const handleMouseDown = (event) => {
    event.stopPropagation();
  };

  return (
    <ListCard>
      <ListingActionArea component="a" onClick={handleShowDetails}>
        <CardHeader title={title} />
        {processedurl && (
          <ImageDiv>
            <CardMedia
              component="img"
              image={processedurl[0]}
              alt="Item listing image"
            />
          </ImageDiv>
        )}
        <CardActions>
          <IconButton onClick={handleLike} onMouseDown={handleMouseDown}>
            <FavoriteBorderIcon />
          </IconButton>
          <CoinsContainer>
            <Typography align="center" variant="h5" color="#eb8736">
              {points}
            </Typography>
            <StyledCoin></StyledCoin>
          </CoinsContainer>
        </CardActions>
      </ListingActionArea>
      <RewardsDialog
        itemId={itemId}
        title={title}
        imageUrls={processedurl}
        category={category}
        description={description}
        deadline={deadline}
        open={open}
        setOpen={setOpen}
        onActionDone={onActionDone}
        buttonText={buttonText}
      />
    </ListCard>
  );
}
