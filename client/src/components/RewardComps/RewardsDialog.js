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
    title,
    category,
    description,
    imageUrls,
    deadline,
    open,
    setOpen,
    onActionDone,
    buttonText,
    points,
    howToRedeem,
    userPoints,
    setUserPoints
  } = props;
  const [isActionError, setIsActionError] = useState(false);
  const [buttonHelperText, setButtonHelperText] = useState("");

  const handleClose = () => {
    setButtonHelperText("");
    setIsActionError(false);
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
        category={category}
        description={description}
        deadline={deadline}
        onActionDone={onActionDone}
        buttonText={buttonText}
        buttonHelperText={buttonHelperText}
        setButtonHelperText={setButtonHelperText}
        isActionError={isActionError}
        setIsActionError={setIsActionError}
        setOpen={setOpen}
        itemId={itemId}
        points={points}
        howToRedeem={howToRedeem}
        userPoints={userPoints}
        setUserPoints={setUserPoints}
      />
    </StyledDialog>
  );
}
