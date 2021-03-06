import styled from "styled-components";
import FollowCard from "./FollowCard";
import List from "@mui/material/List";
import { useAuth } from "../../../database/auth";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../../database/const";
import axios from "axios";

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

  useEffect(() => {
    const getfollowing = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/follow/getfollowers?userId=` + user.id
        );
        setFollowers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getfollowing();
  }, []);
  return (
    <MainContainer>
      <FollowerList>
        {followers.map((u, index) => (
          <FollowCard
            key={index}
            image={u.image}
            username={u.name}
            id={u._id}
            activatebutton={false}
          ></FollowCard>
        ))}
      </FollowerList>
    </MainContainer>
  );
}

export default FollowingDisplay;
