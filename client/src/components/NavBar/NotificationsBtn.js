import { Badge, Box, Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from "react";
import styled from "styled-components";
import { theme } from "../Theme";
import { format } from "timeago.js";
import { useNotifications } from "../../utils/notificationsContext";
import { useNavigate } from "react-router-dom";

const ContrastIconBtn = styled(IconButton)`
    color: ${theme.palette.primary.contrastText};
`;

export default function NotificationsBtn() {
    const {notifications, rmNotification, clearNotifications} = useNotifications();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const onClickNotif = (notification) => {
        rmNotification(notification);
        const url = notification.targetUrl;
        if (url) {
            navigate(url);
        }
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
                              sx={{display: "flex", flexDirection: "column"}}
                              onClick={() => onClickNotif(notification)}>
                                <Typography variant="subtitle2" align="left" noWrap>
                                    {notification.message}
                                </Typography>
                                <Typography variant="caption" align="left" noWrap sx={{fontStyle: "italic"}}>
                                    { format(notification.date) }
                                </Typography>
                            </MenuItem>
                        )
                    }) :
                    <MenuItem>
                        <Typography align="left">No notifications</Typography>
                    </MenuItem>
                }
                { notifications.length ?
                        <Box display="flex" justifyContent="center" width="100%">
                            <Button
                              color="primary"
                              variant="outlined"
                              size="small"
                              onClick={clearNotifications}>
                                Clear all
                            </Button>
                        </Box>
                    : null
                }
            </Menu>
        </>
    );
}