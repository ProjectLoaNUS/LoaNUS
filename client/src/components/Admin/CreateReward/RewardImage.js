import { Box, Card, CardActionArea, CardActions, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import { theme } from "../../Theme";
import { useRef } from "react";

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
  width: max(40%, 300px);
  position: relative;
  overflow: visible;
  & .MuiCardActionArea-root {
    align-self: stretch;
    display: flex;
    flex-direction: column;
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
const MyIconButton = styled(IconButton)`
  padding: 0;
  position: absolute;
  right: -7px;
  top: -7px;
  background-color: ${theme.palette.primary.main};
  color: ${theme.palette.primary.contrastText};

  &:hover {
    background-color: ${theme.palette.primary.light};
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
const HiddenInput = styled.input`
  display: none;
`;

export default function RewardImage(props) {
    const { image, setImage, imageRef } = props;

    const getImgUrl = (img) => {
      if (img) {
        return URL.createObjectURL(img);
      }
      return "";
    };

    const handleChooseImg = () => {
      imageRef.current.click();
    };

    const onImgChosen = (event) => {
      setImage(event.target.files[0]);
    };

    const rmImage = () => {
      imageRef.current.value = null;
      setImage(null);
    }

    return (
      <Box alignSelf="stretch" marginTop="-0.5em">
        <Typography align="left" variant="subtitle2" sx={{paddingLeft: "1em"}}>Image</Typography>
        <ImageStack direction="row">
            { image ?
              <ImageCard>
                  <MyIconButton
                    size="small"
                    color="primary"
                    variant="filled"
                    onClick={rmImage} >
                    <CloseIcon fontSize="inherit" />
                  </MyIconButton>
                <ImageDiv>
                    <CardMedia
                        component="img"
                        image={getImgUrl(image)}
                        alt="Reward image"
                    />
                </ImageDiv>
              </ImageCard> :
              <ImageCard>
                <CardActionArea onClick={handleChooseImg}>
                  <CardMedia>
                      <AddCircleIcon />
                  </CardMedia>
                </CardActionArea>
              </ImageCard>
            }
            <HiddenInput
              type="file"
              id="choose-image"
              accept="image/gif,image/jpeg,image/png,image/svg+xml"
              onChange={onImgChosen}
              ref={imageRef}
            />
        </ImageStack>
      </Box>
    );
}