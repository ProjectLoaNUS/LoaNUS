import { Box, Grow, List, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import styled from "styled-components";
import { BACKEND_URL } from "../../database/const";
import BorrowRequestUser from "./BorrowRequestUser";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../utils/jwt-config";

const BoldedTypo = styled(Typography)`
  font-weight: bold;
`;

export default function BorrowRequestUsers(props) {
    const { userId, isOwner, itemId, setHelperText, setOpen, onActionDone } = props;
    const [users, setUsers] = useState([]);

    const getUserNames = useCallback(async () => {
        if ((userId && itemId) && isOwner) {
            const token = jwt.sign(
                {id: userId},
                JWT_SECRET,
                {expiresIn: JWT_EXPIRES_IN}
            );
            fetch(`${BACKEND_URL}/api/items/getBorrowRequestUsers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                },
                body: JSON.stringify({
                    itemId: itemId
                })
            })
            .then(res => {
                res.json().then(data => {
                    if (res.status === 200) {
                        const userIds = data.userIds.map(userId => {
                            return {userId: userId};
                        });
                        fetch(`${BACKEND_URL}/api/user/getNamesOf`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-auth-token": token
                            },
                            body: JSON.stringify({
                                users: userIds
                            })
                        })
                        .then(res => {
                            res.json().then(json => {
                                if (res.status === 200) {
                                    setUsers(json.userDetails);
                                } else {
                                    console.log(`Error fetching list of users who requested to borrow item with ID ${itemId}`);
                                }
                            });
                        });
                    } else {
                        console.log(data.error);
                    }
                });
            });
        }
    }, [isOwner, itemId, userId]);
    useEffect(() => {
        getUserNames();
    }, [getUserNames]);

    return (
        <TransitionGroup>
          { users?.length &&
            <Grow style={{transformOrigin: "center top"}} timeout={750}>
              <Box display="flex" flexDirection="column" width="100%" alignItems="stretch">
                <BoldedTypo variant="h6" align="left">Borrow requests</BoldedTypo>
                <List>
                    {users.map((user) => {
                        return (
                            <BorrowRequestUser
                              key={user._id}
                              user={user}
                              itemId={itemId}
                              setOpen={setOpen}
                              setHelperText={setHelperText}
                              onActionDone={onActionDone} />
                        )
                    })}
                </List>
              </Box>
            </Grow>
          }
        </TransitionGroup>
    )
}