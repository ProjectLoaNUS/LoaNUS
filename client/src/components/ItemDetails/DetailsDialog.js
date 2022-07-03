import { Button, Dialog, DialogContent, DialogTitle, Grow, IconButton, Link, Slide, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import ImageList from "./ImageList";
import { TransitionGroup } from "react-transition-group";
import { forwardRef, useState } from "react";
import { theme } from "../Theme";
import { useAuth } from "../../database/auth";
import DetailsView from "./DetailsView";

const DialogContainer = styled(DialogContent)`
    display: flex;
    flex-direction: column;
    gap: 0.5ch;
    align-items: stretch;
    padding: 1rem;
`;
const GrowUp = styled(Grow)`
    transform-origin: bottom center;
`;
const Transition = forwardRef(function Transition(props, ref) {
    return <GrowUp ref={ref} {...props} />;
});
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
const CentredButton = styled(Button)`
    align-self: center;
`;

export default function DetailsDialog(props) {
    const { itemId, date, owner, title, category, description, location, telegram, imageUrls, deadline, open, setOpen, onActionDone, buttonAction, buttonText } = props;
    const { user } = useAuth();
    const [ isBtnDisabled, setIsBtnDisabled ] = useState(false);
    const [ isActionError, setIsActionError ] = useState(false);
    const [ buttonHelperText, setButtonHelperText ] = useState("");

    const handleClose = () => {
        setButtonHelperText("");
        setIsActionError(false);
        setIsBtnDisabled(false);
        setOpen(false);
    };

    return (
        <Dialog
          open={open}
          onClose={handleClose}
          scroll="paper"
          fullWidth={true}
          TransitionComponent={Transition}>
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
              user={user} />
        </Dialog>
    );
}