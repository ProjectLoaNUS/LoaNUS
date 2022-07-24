import { Avatar, Button, ButtonGroup, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { getProfilePicUrl } from "../../utils/getProfilePic";
import { approveBorrowAction, denyBorrowAction } from "./detailsDialogActions";

export default function BorrowRequestUser(props) {
    const {user, itemId, setOpen, setHelperText, onActionDone} = props;
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [approveBtnError, setApproveBtnError] = useState(null);
    const [denyBtnError, setDenyBtnError] = useState(null);

    const setBtnStatus = (setBtnError) => {
        return async (isError, helperText) => {
            setBtnError(isError);
            setHelperText(helperText);
        };
    };

    useEffect(() => {
        getProfilePicUrl(user._id).then(url => {
            setProfilePicUrl(url);
        });
    }, [user]);

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar src={profilePicUrl} alt={user?.name || "U"} />
            </ListItemAvatar>
            <ListItemText primary={user?.name || "..."} />
            <ButtonGroup aria-label="primary button group">
                <Button
                  color={approveBtnError === null ? "primary" : (approveBtnError ? "error" : "success")}
                  variant="contained"
                  onClick={approveBorrowAction(
                    setBtnStatus(setApproveBtnError),
                        setOpen, onActionDone, itemId, {id: user?._id}
                  )}>
                    Approve
                </Button>
                <Button
                  color={denyBtnError === null ? "primary" : (denyBtnError ? "error" : "success")}
                  variant="outlined"
                  onClick={denyBorrowAction(
                    setBtnStatus(setDenyBtnError),
                        setOpen, onActionDone, itemId, {id: user?._id}
                  )}>
                    Deny
                </Button>
            </ButtonGroup>
        </ListItem>
    )
}