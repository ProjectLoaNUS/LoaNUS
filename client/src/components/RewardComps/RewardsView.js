import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Grow,
  IconButton,
  Slide,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import { theme } from "../Theme";
import ImageList from "../ItemDetails/ImageList";
import { TransitionGroup } from "react-transition-group";
import { CentredDiv } from "../FlexDiv";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";
import { Buffer } from "buffer";
import { useEffect } from "react";
import { useState } from "react";

const DialogContainer = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 0.5ch;
  align-items: stretch;
  padding: 1rem;
  overflow-y: auto;

  div:not([class]) {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 0;
    width: 100%;
  }
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
`;
const ContrastTypo = styled(Typography)`
  white-space: pre-wrap;
  color: ${theme.palette.secondary.main};
`;
const BoldedTypo = styled(Typography)`
  font-weight: bold;
`;
const ButtonGroup = styled(CentredDiv)`
  gap: 1rem;
`;
const ImageDiv = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  height: max(50vh, 300px);
  aspect-ratio: 1 / 1;

  img {
    min-height: 0;
    object-fit: contain;
  }
`;

export default function RewardsView(props) {
  const {
    imageUrls,
    handleClose,
    title,
    category,
    description,
    deadline,
    buttonText,
    buttonHelperText,
    isActionError,
    setOpen,
    setReward,
    itemId,
    user,
    points,
    howToRedeem,
    setUser
  } = props;
  const [ urlToRedeem, setUrlToRedeem ] = useState("");
  const [ qrCodeUrl, setQrCodeUrl ] = useState("");
  const [ showQrCode, setShowQrCode ] = useState(false);

  const handleClick = async () => {
    try {
      let data = {
        item: itemId,
        user: user.id,
      };
      axios.post(`${BACKEND_URL}/api/reward/claimreward`, data);
      await axios
        .get(`${BACKEND_URL}/api/reward/getrewards?category=` + category)
        .then((res) => {
          setReward(res.data);
        })
        .catch((err) => console.log(err, "error occured"));
      setOpen(false);
      setUser((prevUser) => {
        const newPoints = prevUser.points - points;
        const newUser = {...prevUser, points: newPoints};
        return newUser;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const redeem = async () => {
    if (qrCodeUrl) {
      setShowQrCode(true);
    } 
    if (urlToRedeem) {
      window.open(urlToRedeem,'_blank');
    }
  }

  const imgToUrl = async (img) => {
    const binary = Buffer.from(img.data);
    const blob = new Blob([binary.buffer], {
      type: img.contentType,
    });
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    if (howToRedeem) {
      if (howToRedeem.url) {
        setUrlToRedeem(howToRedeem.url);
      }
      if (howToRedeem.qrCode) {
        imgToUrl(howToRedeem.qrCode).then((url) => setQrCodeUrl(url));
      }
    }
  }, [howToRedeem]);

  return (
    <>
      <DialogTitle>
        Reward Listing
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "rgba(0, 0, 0, 0.87)",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContainer>
        <Typography variant="h4" align="left">
          {title}
        </Typography>
        {imageUrls && <ImageList imageUrls={imageUrls} />}

        <Row>
          <Typography variant="body1" align="left">
            In
          </Typography>
          <ContrastTypo variant="body1" align="left">
            {" "}
            {category}
          </ContrastTypo>
        </Row>
        <BoldedTypo variant="h6" align="left">
          Description
        </BoldedTypo>
        <Typography variant="body1" align="left">
          {description}
        </Typography>
        {deadline && (
          <>
            <BoldedTypo variant="h6" align="left">
              Use by
            </BoldedTypo>
            <Typography variant="body1" align="left">
              {deadline}
            </Typography>
          </>
        )}

        <ButtonGroup>
          <Button
            disabled={!howToRedeem && (user.points >= points ? false : true)}
            variant="contained"
            color={isActionError ? "error" : "primary"}
            onClick={howToRedeem ? redeem : handleClick}
          >
            {buttonText}
          </Button>
        </ButtonGroup>
        <TransitionGroup>
          {buttonHelperText && (
            <Slide direction="right">
              <Typography
                variant="subtitle1"
                align="center"
                color={isActionError ? "error" : "success.main"}
              >
                {buttonHelperText}
              </Typography>
            </Slide>
          )}
        </TransitionGroup>
        <TransitionGroup>
          {showQrCode &&
            <Grow style={{transformOrigin: "center top"}} timeout={750}>
              <ImageDiv>
                <img src={qrCodeUrl} />
              </ImageDiv>
            </Grow>
          }
        </TransitionGroup>
        
      </DialogContainer>
    </>
  );
}
