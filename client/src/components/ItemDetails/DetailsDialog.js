import { Dialog, Grow } from "@mui/material";
import styled from "styled-components";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useAuth } from "../../database/auth";
import DetailsView from "./DetailsView";
import ChatView from "./ChatView";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";

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

export default function DetailsDialog(props) {
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
    borrowRequests,
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
  const [chat, setChat] = useState(null);

  const handleClose = () => {
    setButtonHelperText("");
    setIsActionError(false);
    setIsBtnDisabled(false);
    setIsDetailsView(true);
    setOpen(false);
  };

  const fetchChat = useCallback(async () => {
      if (owner && user) {
          let convoUsers = {
              senderId: user.id,
              receiverId: owner.id,
          };
          try {
              axios.post(
                  `${BACKEND_URL}/api/conversations`,
                  convoUsers
              )
              .then(res => {
                  setChat(res.data);
              });
          } catch (err) {
              console.log(err);
          }
      }
  }, [owner, user]);

  useEffect(() => {
      if (open) {
          fetchChat();
      }
  }, [open, fetchChat]);

  return (
      <StyledDialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        TransitionComponent={Transition}>
          { isDetailsView ? 
              <DetailsView
                imageUrls={imageUrls}
                handleClose={handleClose}
                title={title}
                date={date}
                owner={owner}
                category={category}
                description={description}
                deadline={deadline}
                location={location}
                borrowRequests={borrowRequests}
                buttonAction={buttonAction}
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
                openChat={() => setIsDetailsView(false)} />
          :
              <ChatView
                user={user}
                owner={owner}
                chat={chat}
                backToDetails={() => setIsDetailsView(true)}
                handleClose={handleClose} />
          }
      </StyledDialog>
  );
}
