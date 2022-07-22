import { Avatar, Box, Button, ButtonGroup, Grow, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import styled from "styled-components";
import { BACKEND_URL } from "../../database/const";
import { getProfilePicUrl } from "../../utils/getProfilePic";

const BoldedTypo = styled(Typography)`
  font-weight: bold;
`;

export default function BorrowRequestUsers(props) {
    const { isOwner, itemId } = props;
    const [users, setUsers] = useState([]);

    const getUserNames = useCallback(async () => {
        if (itemId && isOwner) {
            fetch(`${BACKEND_URL}/api/items/getBorrowRequestUsers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    itemId: itemId
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "ok") {
                    const userIds = data.userIds.map(userId => {
                        return {userId: userId};
                    });
                    fetch(`${BACKEND_URL}/api/user/getNamesOf`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            users: userIds
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 'ok') {
                            setUsers(data.userDetails);
                        } else {
                            console.log(`Error fetching list of users who requested to borrow item with ID ${itemId}`);
                        }
                    });
                }
            })
        }
    }, [isOwner, itemId]);
    useEffect(() => {
        getUserNames();
    }, [getUserNames]);

    function BorrowingUser(props) {
        const {user} = props;
        const [profilePicUrl, setProfilePicUrl] = useState("");

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
                <ButtonGroup aria-label="outlined primary button group">
                    <Button variant="contained" >Approve</Button>
                    <Button variant="outlined">Deny</Button>
                </ButtonGroup>
            </ListItem>
        )
    }

    return (
        <TransitionGroup>
          { users?.length &&
            <Grow style={{transformOrigin: "center top"}} timeout={750}>
              <Box display="flex" flexDirection="column" width="100%" alignItems="stretch">
                <BoldedTypo variant="h6" align="left">Borrow requests</BoldedTypo>
                <List>
                    {users.map((user, index) => {
                        return <BorrowingUser key={index} user={user} />
                    })}
                </List>
              </Box>
            </Grow>
          }
        </TransitionGroup>
    )
}