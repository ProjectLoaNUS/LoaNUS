import { Badge, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from "react";
import styled from "styled-components";
import { theme } from "../Theme";
import { format } from "timeago.js";
import { useNotifications } from "../../utils/notificationsContext";

const ContrastIconBtn = styled(IconButton)`
    color: ${theme.palette.primary.contrastText};
`;

export default function NotificationsBtn() {
    const {notifications} = useNotifications();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <ContrastIconBtn id="notif-btn" onClick={handleClick}>
                <Badge badgeContent={notifications.length} color="secondary">
                    <NotificationsIcon />
                </Badge>
            </ContrastIconBtn>
            <Menu
              id="notifications"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'notif-btn',
              }}>
                {notifications.length ? 
                    notifications.map((notification, index) => {
                        return (
                            <MenuItem
                              key={index}
                              sx={{display: "flex", flexDirection: "column"}}>
                                <Typography variant="subtitle2" align="left" noWrap>
                                    {notification.message}
                                </Typography>
                                <Typography variant="caption" align="left" noWrap>
                                    { format(notification.date) }
                                </Typography>
                            </MenuItem>
                        )
                    }) :
                    <MenuItem>
                        <Typography align="left">No notifications</Typography>
                    </MenuItem>
                }
            </Menu>
        </>
    );
}