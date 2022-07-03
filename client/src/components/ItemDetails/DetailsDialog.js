import { Dialog, Grow } from "@mui/material";
import styled from "styled-components";
import { forwardRef, useEffect, useState } from "react";
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

export default function DetailsDialog(props) {
    const { itemId, date, owner, title, category, description, location, telegram, imageUrls, deadline, open, setOpen, onActionDone, buttonAction, buttonText } = props;
    const { user } = useAuth();
    const [ isBtnDisabled, setIsBtnDisabled ] = useState(false);
    const [ isActionError, setIsActionError ] = useState(false);
    const [ buttonHelperText, setButtonHelperText ] = useState("");
    const [ isDetailsView, setIsDetailsView ] = useState(true);
    const [ chat, setChat ] = useState(null);

    const handleClose = () => {
        setButtonHelperText("");
        setIsActionError(false);
        setIsBtnDisabled(false);
        setOpen(false);
    };

    const fetchChat = async () => {
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
    };

    useEffect(() => {
        fetchChat();
    }, []);

    return (
        <Dialog
          open={open}
          onClose={handleClose}
          scroll="paper"
          fullWidth={true}
          TransitionComponent={Transition}>
            { isDetailsView ? 
                <DetailsView
                  imageUrls={imageUrls}
                  handleClose={handleClose}
                  title={title}
                  date={date}
                  userName={owner && owner.name}
                  category={category}
                  description={description}
                  deadline={deadline}
                  location={location}
                  telegram={telegram}
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
        </Dialog>
    );
}