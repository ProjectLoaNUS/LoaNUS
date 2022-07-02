import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";

export default function NotSignedInToast(props) {
    const { open, message } = props;
    const [ isOpen, setIsOpen ] = useState(open);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setIsOpen(false);
    };

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message || "Please sign in to continue"}
            action={
                <IconButton aria-label="close" color="inherit" size="small" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            } />
    );
}