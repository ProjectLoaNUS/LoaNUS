import { DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from "styled-components";
import ChatBox from "../ChatComps/ChatBox";

const DialogContainer = styled(DialogContent)`
    display: flex;
    flex-direction: column;
    gap: 0.5ch;
    align-items: stretch;
    padding: 1rem;
    overflow-y: hidden;
`;

export default function ChatView(props) {
    const { owner, chat, backToDetails, handleClose } = props;

    return (
        <>
            <DialogTitle align="center">
                <IconButton
                  aria-label="back"
                  onClick={backToDetails}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: 8,
                    color: 'rgba(0, 0, 0, 0.87)',
                  }}
                >
                    <ArrowBackIcon />
                </IconButton>
                {owner && owner.name}
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
                <ChatBox
                  currentChat={chat} />
            </DialogContainer>
        </>
    )
}