import {
  Button,
  DialogContent,
  DialogTitle,
  Grow,
  IconButton,
  Link,
  Slide,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import { theme } from "../../utils/Theme";
import ImageList from "./ImageList";
import { TransitionGroup } from "react-transition-group";
import { CentredDiv } from "../../utils/FlexDiv";
import BorrowRequestUsers from "./BorrowRequestUsers";
import { useEffect } from "react";

const DialogContainer = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 0.5ch;
  align-items: stretch;
  padding: 1rem;
  overflow-y: auto;
`;
const GrowUp = styled(Grow)`
  transform-origin: bottom center;
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

export default function DetailsView(props) {
  const {
    imageUrls,
    handleClose,
    title,
    date,
    owner,
    category,
    description,
    deadline,
    location,
    borrowRequests,
    buttonAction,
    onActionDone,
    buttonText,
    buttonHelperText,
    setButtonHelperText,
    isActionError,
    setIsActionError,
    isBtnDisabled,
    setIsBtnDisabled,
    setOpen,
    itemId,
    user,
    openChat,
  } = props;
  const isOwner = owner && owner.id === user?.id;

  const setError = (isError, helperText) => {
    setIsActionError(isError);
    setButtonHelperText(helperText);
  };

  const setIsButtonEnabled = (isEnabled) => {
    setIsBtnDisabled(!isEnabled);
  };

  useEffect(() => {
    if (
      borrowRequests?.length &&
      user &&
      borrowRequests.some((userId) => userId === user.id)
    ) {
      setIsBtnDisabled(true);
      setButtonHelperText("Already requested to borrow this");
    }
  }, [borrowRequests, user]);

  return (
    <>
      <DialogTitle>
        {imageUrls ? "Item Listing" : "Item Request"}
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
            {date} by
          </Typography>
          <ContrastTypo variant="body1" align="left">
            {" "}
            {owner && owner.name}
          </ContrastTypo>
        </Row>
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
              Return deadline
            </BoldedTypo>
            <Typography variant="body1" align="left">
              {deadline}
            </Typography>
          </>
        )}
        <BoldedTypo variant="h6" align="left">
          Meet-up
        </BoldedTypo>
        <Typography variant="body1" align="left">
          {location}
        </Typography>
        <BorrowRequestUsers
          isOwner={isOwner}
          itemId={itemId}
          setHelperText={setButtonHelperText}
          setOpen={setOpen}
          onActionDone={onActionDone}
        />
        <ButtonGroup>
          {!isOwner && (
            <Button variant="outlined" color="primary" onClick={openChat}>
              Chat
            </Button>
          )}
          {buttonText && (
            <Button
              disabled={isBtnDisabled}
              variant="contained"
              color={isActionError ? "error" : "primary"}
              onClick={buttonAction(
                setError,
                setIsButtonEnabled,
                setOpen,
                onActionDone,
                itemId,
                user
              )}
            >
              {buttonText}
            </Button>
          )}
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
