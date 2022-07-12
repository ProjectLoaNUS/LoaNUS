import {
  Button,
  DialogContent,
  DialogTitle,
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

const DialogContainer = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 0.5ch;
  align-items: stretch;
  padding: 1rem;
  overflow-y: auto;
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
    setUser,
  } = props;

  const HandleClick = async () => {
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
        let newUser = structuredClone(prevUser);
        newUser.points -= points;
        return newUser;
      });
    } catch (err) {
      console.log(err);
    }
  };
  console.log(points);
  console.log(user.points);

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
            disabled={user.points >= points ? false : true}
            variant="contained"
            color={isActionError ? "error" : "primary"}
            onClick={HandleClick}
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
      </DialogContainer>
    </>
  );
}
