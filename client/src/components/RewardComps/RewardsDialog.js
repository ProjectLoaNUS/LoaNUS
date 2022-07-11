import { Dialog, Grow } from "@mui/material";
import styled from "styled-components";
import { forwardRef, useEffect, useState } from "react";
import { useAuth } from "../../database/auth";
import DetailsView from "../ItemDetails/DetailsView";
import ChatView from "../ItemDetails/ChatView";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";
import RewardsView from "./RewardsView";

const GrowUp = styled(Grow)`
  transform-origin: bottom center;
`;
const Transition = forwardRef(function Transition(props, ref) {
  return <GrowUp ref={ref} {...props} />;
});
const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    overflow-y: hidden;
  }
`;

export default function RewardsDialog(props) {
  const {
    itemId,
    date,
    owner,
    title,
    category,
    description,
    location,
    imageUrls,
    deadline,
    open,
    setOpen,
    onActionDone,
    buttonAction,
    buttonText,
  } = props;
  const { user } = useAuth();
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [isActionError, setIsActionError] = useState(false);
  const [buttonHelperText, setButtonHelperText] = useState("");
  const [isDetailsView, setIsDetailsView] = useState(true);

  const handleClose = () => {
    setButtonHelperText("");
    setIsActionError(false);
    setIsBtnDisabled(false);
    setIsDetailsView(true);
    setOpen(false);
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      TransitionComponent={Transition}
    >
      <RewardsView
        imageUrls={imageUrls}
        handleClose={handleClose}
        title={title}
        date={date}
        owner={owner}
        category={category}
        description={description}
        deadline={deadline}
        location={location}
        onActionDone={onActionDone}
        buttonText={buttonText}
        buttonHelperText={buttonHelperText}
        setButtonHelperText={setButtonHelperText}
        isActionError={isActionError}
        setIsActionError={setIsActionError}
        isBtnDisabled={isBtnDisabled}
        setIsBtnDisabled={setIsBtnDisabled}
        setOpen={setOpen}
        itemId={itemId}
        user={user}
      />
    </StyledDialog>
  );
}
