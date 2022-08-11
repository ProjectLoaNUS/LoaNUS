import styled from "styled-components";
import FollowCard from "./FollowCard";
import List from "@mui/material/List";
import { useAuth } from "../../../database/auth";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../../database/const";
import axios from "axios";
import jwt from "jsonwebtoken";
import { Typography } from "@mui/material";
import { LoadingFollowCards } from "./FollowCard";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../../utils/jwt-config";

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;
const FollowingList = styled(List)`
  width: max(265px, 30%);
  min-height: 0%;
  max-height: 100%;
  padding-right: 6px;
  overflow-y: auto;
`;

function FollowingDisplay() {
  const { user } = useAuth();
  const [ following, setFollowing ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const getFollowing = async () => {
      try {
        const token = jwt.sign(
          {id: user.id},
          JWT_SECRET,
          {expiresIn: JWT_EXPIRES_IN}
        );
        const res = await axios.get(
          `${BACKEND_URL}/api/follow/getfollowing`, {
            headers: {
              "x-auth-token": token
            }
          }
        );
        setIsLoading(false);
        setFollowing(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFollowing();
  }, []);

  return (
    <MainContainer>
      { following && following.length ?
        <FollowingList>
          {following.map((u, index) => (
            <FollowCard
              key={u._id}
              username={u.name}
              id={u._id}
              followed={true}
              activatebutton={true}
            ></FollowCard>
          ))}
        </FollowingList> :
        ( isLoading ?
          <LoadingFollowCards numOfCards={3} />
          :
          <Typography variant="subtitle1" align="center" sx={{paddingTop: "1em"}}>
            Not following anyone. Follow some users in the 'Search users' tab!
          </Typography>
        )
      }
    </MainContainer>
  );
}

export default FollowingDisplay;
