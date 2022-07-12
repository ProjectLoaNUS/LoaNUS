import {
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import styled from "styled-components";

import { useState } from "react";

import { Buffer } from "buffer";

import RewardsDialog from "./RewardsDialog";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

const ListCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 0 0 auto;
  & .MuiCardHeader-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 550;
    color: #2d3c4a;
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
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;
const StyledCoin = styled(CurrencyExchangeIcon)`
  color: #2d3c4a;
  margin-right: 2px;
  transform: scale(1);
  margin-left: 5px;
`;
const CoinsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const StyledCardActions = styled(CardActions)`
  display: flex;
  flex-direction: row;
  justify-content: end;
`;

export default function RewardCard(props) {
  const { itemDetails, buttonText, onActionDone, setReward } = props;
  const [open, setOpen] = useState(false);

  const binary = Buffer.from(itemDetails.image.data.data);
  const blob = new Blob([binary.buffer], {
    type: itemDetails.image.contentType,
  });
  const url = URL.createObjectURL(blob);
  let processedurl = [];
  processedurl.push(url);

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
        <StyledCardActions>
          <CoinsContainer>
            <StyledCoin></StyledCoin>
            <Typography align="center" variant="h5" color="#eb8736">
              {points}
            </Typography>
          </CoinsContainer>
        </StyledCardActions>
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
        setReward={setReward}
        points={points}
      />
    </ListCard>
  );
}
