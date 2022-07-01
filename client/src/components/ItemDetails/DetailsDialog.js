import { Button, Dialog, DialogContent, DialogTitle, Grow, IconButton, Link, Slide, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import ImageList from "./ImageList";
import { TransitionGroup } from "react-transition-group";
import { forwardRef, useState } from "react";
import { theme } from "../Theme";
import { useAuth } from "../../database/auth";

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
    const { itemId, date, userName, title, isRequest, category, description, location, telegram, imageUrls, deadline, open, setOpen, onActionDone, buttonAction, buttonText } = props;
    const telegramUsername = telegram ? telegram.replace("@", "") : "";
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

    const onClickChat = () => {
        const telegramUrl = "https://t.me/" + telegramUsername;
        const chatOnTelegram = window.open(telegramUrl, '_blank', 'noopener,noreferrer');
        if (chatOnTelegram) {
            chatOnTelegram.opener = null;
        }
    }

    const setError = (isError, helperText) => {
        setIsActionError(isError);
        setButtonHelperText(helperText);
    }

    const setIsButtonEnabled = (isEnabled) => {
        setIsBtnDisabled(!isEnabled);
    }

    return (
        <Dialog
          open={open}
          onClose={handleClose}
          scroll="paper"
          fullWidth={true}
          TransitionComponent={Transition}>
            <DialogTitle>
                {imageUrls ? "Item Listing" : "Item Request"}
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'rgba(0, 0, 0, 0.87)',
                  }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContainer>
                <Typography variant="h3" align="left">{ title }</Typography>
                {imageUrls && <ImageList imageUrls={imageUrls} />}
                <Row>
                    <Typography variant="body1" align="left">{date} by</Typography>
                    <ContrastTypo variant="body1" align="left"> {userName}</ContrastTypo>
                </Row>
                <Row>
                    <Typography variant="body1" align="left">In</Typography>
                    <ContrastTypo variant="body1" align="left"> {category}</ContrastTypo>
                </Row>
                <BoldedTypo variant="h6" align="left">Description</BoldedTypo>
                <Typography variant="body1" align="left">{description}</Typography>
                {deadline && (
                    <>
                        <BoldedTypo variant="h6" align="left">Return deadline</BoldedTypo>
                        <Typography variant="body1" align="left">{deadline}</Typography>
                    </>
                )}
                <BoldedTypo variant="h6" align="left">Meet-up</BoldedTypo>
                <Typography variant="body1" align="left">{location}</Typography>
                <Link variant="body1" onClick={ onClickChat } color="secondary">Contact {telegram}</Link>
                <CentredButton disabled={isBtnDisabled} variant="contained" color={isActionError ? "error" : "primary"} onClick={buttonAction(setError, setIsButtonEnabled, setOpen, onActionDone, itemId, user)}>{buttonText}</CentredButton>
                <TransitionGroup>
                    { buttonHelperText &&
                        <Slide direction="right">
                            <Typography variant="subtitle1" align="center" color={ isActionError ? "error" : "success.main" }>{buttonHelperText}</Typography>
                        </Slide>
                    }
                </TransitionGroup>
            </DialogContainer>
        </Dialog>
    );
}