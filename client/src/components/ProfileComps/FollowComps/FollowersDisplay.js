import styled from "styled-components";
import FollowCard from "./FollowCard";
import List from "@mui/material/List";
import { useAuth } from "../../../database/auth";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../../database/const";
import axios from "axios";
import { Typography } from "@mui/material";
import { LoadingFollowCards } from "./FollowCard";

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;
const FollowerList = styled(List)`
  width: max(265px, 30%);
  min-height: 0%;
  max-height: 100%;
  padding-right: 6px;
  overflow-y: auto;
`;

function FollowingDisplay() {
  const { user } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const getFollowing = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/follow/getfollowers?userId=` + user.id
        );
        setIsLoading(false);
        setFollowers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFollowing();
  }, []);

  return (
    <MainContainer>
      { followers && followers.length ?
        <FollowerList>
          {followers.map((u, index) => (
            <FollowCard
              key={u._id}
              username={u.name}
              id={u._id}
              activatebutton={false}
            ></FollowCard>
          ))}
        </FollowerList> :
        ( isLoading ?
          <LoadingFollowCards numOfCards={3} />
          :
          <Typography variant="subtitle1" align="center" sx={{paddingTop: "1em"}}>
            No followers yet.
          </Typography>
        )
      }
    </MainContainer>
  );
}

export default FollowingDisplay;
