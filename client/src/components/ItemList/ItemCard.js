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
import { useState } from "react";
import DetailsDialog from "../ItemDetails/DetailsDialog";
import { borrowAction, deleteListingAction, isUserListingRelated } from "../ItemDetails/detailsDialogActions";
import { useAuth } from "../../database/auth";
import NoImage from "../../assets/no-image.png";
import { CATEGORIES } from "../NewItem/ItemCategories";

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

export default function ItemCard(props) {
  const {
    itemDetails,
    imageUrls,
    buttonText,
    onActionDone,
    onClickAction
  } = props;
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const processedImageUrls = imageUrls && ( imageUrls.length === 0 ? [NoImage] : imageUrls );
  
  const itemId = itemDetails._id;
  const date = new Date(itemDetails.date).toLocaleDateString({}, 
    {year: 'numeric', month: 'short', day: 'numeric'});
  const deadline = new Date(itemDetails.deadline).toLocaleDateString({}, 
    {year: 'numeric', month: 'short', day: 'numeric'});
  const category = CATEGORIES[itemDetails.category];
  const title = itemDetails.title;
  const owner = itemDetails.listedBy;
  const description = itemDetails.description;
  const location = itemDetails.location;
  const isOwner = isUserListingRelated(user, {listedBy: owner});

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

  const getItemCardAction = () => {
      if (isOwner) {
          return deleteListingAction;
      } else {
          return borrowAction;
      }
  }

  return (
    <ListCard>
      <ListingActionArea component="a" onClick={handleShowDetails}>
        <CardHeader 
          avatar={
            <Avatar>{owner && (owner.name && owner.name.charAt(0))}</Avatar>
          }
          title={owner && owner.name}
          subheader={date} />
        {processedImageUrls &&
          <ImageDiv>
            <CardMedia 
              component="img"
              image={processedImageUrls[0]}
              alt="Item listing image" />
          </ImageDiv>
        }
        <CardActions>
          <IconButton onClick={handleLike} onMouseDown={handleMouseDown}>
            <FavoriteBorderIcon />
          </IconButton>
          <Typography align="center" variant="caption">
            {title}
          </Typography>
        </CardActions>
      </ListingActionArea>
      <DetailsDialog
        itemId={itemId}
        date={date}
        owner={owner}
        title={title}
        imageUrls={processedImageUrls}
        category={category}
        description={description}
        location={location}
        deadline={deadline}
        open={open}
        setOpen={setOpen}
        onActionDone={onActionDone}
        buttonAction={onClickAction || getItemCardAction()}
        buttonText={buttonText || (isOwner ? "Delete Listing" : "Borrow It!")} />
    </ListCard>
  );
}
