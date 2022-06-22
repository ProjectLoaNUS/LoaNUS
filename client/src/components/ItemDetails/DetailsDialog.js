import { Dialog, DialogContent, DialogTitle, Grow, IconButton, Link, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import ImageList from "./ImageList";
import { forwardRef } from "react";

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

export default function DetailsDialog(props) {
    const { date, userName, title, isRequest, category, description, location, telegram, imageUrls, deadline, open, setOpen } = props;

    const handleClose = () => {
        setOpen(false);
    };

    const onClickChat = (event) => {

    }

    return (
        <Dialog
          open={open}
          onClose={handleClose}
          scroll="paper"
          fullWidth={true}
          TransitionComponent={Transition}>
            <DialogTitle>
                Item Listing
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
                <Typography variant="caption" align="left">{date} by {userName}</Typography>
                <Typography variant="caption" align="left">In {category}</Typography>
                <Typography variant="body1" align="left">{description}</Typography>
                {deadline && (
                    <>
                        <Typography variant="subtitle1" align="left">Return deadline</Typography>
                        <Typography variant="caption" align="left">{deadline}</Typography>
                    </>
                )}
                <Typography variant="subtitle1" align="left">Meet-up</Typography>
                <Typography variant="subtitle2" align="left">{location}</Typography>
                <Link variant="subtitle2" onClick={ onClickChat }>Contact {telegram}</Link>
            </DialogContainer>
        </Dialog>
    );
}