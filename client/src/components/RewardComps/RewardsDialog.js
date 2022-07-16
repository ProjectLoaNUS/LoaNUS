import { Dialog, Grow } from "@mui/material";
import styled from "styled-components";
import { forwardRef, useState } from "react";
import { useAuth } from "../../database/auth";
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
    setReward,
    onActionDone,
    buttonText,
    points,
    howToRedeem
  } = props;
  const { user, setUser } = useAuth();
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [isActionError, setIsActionError] = useState(false);
  const [buttonHelperText, setButtonHelperText] = useState("");

  const handleClose = () => {
    setButtonHelperText("");
    setIsActionError(false);
    setIsBtnDisabled(false);
    setOpen(false);
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      TransitionComponent={Transition}
      scroll="paper"
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
        setReward={setReward}
        itemId={itemId}
        user={user}
        points={points}
        setUser={setUser}
        howToRedeem={howToRedeem}
      />
    </StyledDialog>
  );
}
