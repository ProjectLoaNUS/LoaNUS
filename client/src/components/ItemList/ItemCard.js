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
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import DetailsDialog from "../ItemDetails/DetailsDialog";
import {
  requestBorrowAction,
  deleteListingAction,
  isUserListingRelated,
} from "../ItemDetails/detailsDialogActions";
import { useAuth } from "../../database/auth";
import { Buffer } from "buffer";
import NoImage from "../../assets/no-image.png";
import { CATEGORIES } from "../NewItem/ItemCategories";
import { BACKEND_URL } from "../../database/const";
import { getProfilePicUrl } from "../../utils/getProfilePic";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useLocation } from "react-router-dom";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../utils/jwt-config";

const ListCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 0 0 auto;
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
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

export default function ItemCard(props) {
  const {
    itemDetails,
    imageUrls,
    buttonText,
    isOwnerButtonText,
    onActionDone,
    onClickAction,
    isOwnerOnClickAction
  } = props;
  const [open, setOpen] = useState(false);
  const [ownerPicUrl, setOwnerPicUrl] = useState("");
  const [liked, setLiked] = useState(false);
  const { user, setUser } = useAuth();
  const processedImageUrls =
    imageUrls && (imageUrls.length === 0 ? [NoImage] : imageUrls);

  const itemId = itemDetails._id;
  const date = new Date(itemDetails.date).toLocaleDateString(
    {},
    { year: "numeric", month: "short", day: "numeric" }
  );
  const deadline = itemDetails.deadline && (new Date(itemDetails.deadline).toLocaleDateString(
    {},
    { year: "numeric", month: "short", day: "numeric" }
  ));
  const category = CATEGORIES[itemDetails.category];
  const title = itemDetails.title;
  const owner = itemDetails.listedBy;
  const description = itemDetails.description;
  const location = itemDetails.location;
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const reactLocation = useLocation();

  const handleShowDetails = async (category, userid) => {
    setOpen(true);
    // Don't update user's interested categories if he/she is the owner or this is an item request
    if (!isOwner && itemDetails?.deadline) {
      try {
        let data = {
          itemcategory: category
        };
        const token = jwt.sign(
          {id: user.id},
          JWT_SECRET,
          {expiresIn: JWT_EXPIRES_IN}
        );
        axios.post(`${BACKEND_URL}/api/user/updaterecommendation`,
            data,
            { headers: { "x-auth-token": token } }
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleLike = (event) => {
    event.stopPropagation();
    event.preventDefault();
    let data = {
      itemId: itemId
    };
    const token = jwt.sign(
      {id: user.id},
      JWT_SECRET,
      {expiresIn: JWT_EXPIRES_IN}
    );
    if (liked) {
      try {
        axios.post(`${BACKEND_URL}/api/items/unlikeitem`,
            data,
            { headers: { "x-auth-token": token } }
        );
      } catch (error) {
        console.log(error);
      }
      setLiked(false);
    } else {
      try {
        axios.post(`${BACKEND_URL}/api/items/likeitem`,
            data,
            { headers: { "x-auth-token": token } }
        );
      } catch (error) {
        console.log(error);
      }
      setLiked(true);
    }
  };

  const handleMouseDown = (event) => {
    event.stopPropagation();
  };

  const getItemCardAction = () => {
      if (isOwner || isAdmin) {
          return isOwnerOnClickAction || deleteListingAction;
      } else {
          return onClickAction || requestBorrowAction;
      }
  }

  const getButtonText = (isUserOwner) => {
    if (isAdmin || isUserOwner) {
      return isOwnerButtonText || "Delete Listing";
    } else {
      return buttonText;
    }
  }

  useEffect(() => {
    if (user && owner) {
      setIsOwner(isUserListingRelated(user, { listedBy: owner }));
    }
  }, [user, owner]);
  useEffect(() => {
    if (reactLocation.pathname === "/admin/listings") {
      setIsAdmin(true);
    }
  }, [reactLocation]);

  useEffect(() => {
    if (user?.id) {
      const token = jwt.sign(
        {id: user.id},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
      );
      axios
        .get(`${BACKEND_URL}/api/items/getlikeditems`, {
          headers: { "x-auth-token": token }
        })
        .then((res) => {
          if (res.data.items.includes(itemId)) {
            setLiked(true);
          }
        });
    }
  }, [user, itemId]);

  useEffect(() => {
    if (!!owner) {
      if (!isOwner) {
        getProfilePicUrl(owner.id).then(url => setOwnerPicUrl(url));
      } else {
        let photoURL;
        if (!user.photoURL && user.photodata && user.photoformat) {
          const binary = Buffer.from(user.photodata);
          const blob = new Blob([binary.buffer], { type: user.photoformat });
          photoURL = URL.createObjectURL(blob);
          setUser((prevUser) => {
            return { ...prevUser, photoURL: photoURL };
          });
        } else if (user.photoURL) {
          photoURL = user.photoURL;
        } else {
          photoURL = "";
        }
        setOwnerPicUrl(photoURL);
      }
    }
  }, [owner]);

  return (
    <ListCard>
      <ListingActionArea
        component="a"
        onClick={() => handleShowDetails(itemDetails.category, user?.id)}
      >
        <CardHeader
          avatar={
            <Avatar src={ownerPicUrl}>
              {!ownerPicUrl && owner && owner.name && owner.name.charAt(0)}
            </Avatar>
          }
          title={owner && owner.name}
          subheader={date}
        />
        {processedImageUrls && (
          <ImageDiv>
            <CardMedia
              component="img"
              image={processedImageUrls[0]}
              alt="Item listing image"
            />
          </ImageDiv>
        )}
        <CardActions>
          {(!isOwner && !isAdmin && itemDetails?.deadline) && (
            <IconButton onClick={handleLike} onMouseDown={handleMouseDown}>
              {liked ? (
                <FavoriteIcon style={{ color: "#f24464" }}></FavoriteIcon>
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          )}
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
        borrowRequests={itemDetails.borrowRequests}
        open={open}
        setOpen={setOpen}
        onActionDone={onActionDone}
        buttonAction={getItemCardAction()}
        buttonText={getButtonText(isOwner)} />
    </ListCard>
  );
}
