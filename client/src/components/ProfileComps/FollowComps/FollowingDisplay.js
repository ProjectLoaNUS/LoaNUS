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
const FollowingList = styled(List)`
  width: max(265px, 30%);
  min-height: 0%;
  max-height: 100%;
  padding-right: 6px;
  overflow-y: auto;
`;

function FollowingDisplay() {
  const { user } = useAuth();
  const [following, setFollowing] = useState([]);

  console.log(user);
  useEffect(() => {
    const getfollowing = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/follow/getfollowing?userId=` + user.id
        );
        setFollowing(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getfollowing();
  }, []);
  return (
    <MainContainer>
      <FollowingList>
        {following.map((u, index) => (
          <FollowCard
            key={index}
            image={u.image}
            username={u.name}
            id={u._id}
            followed={true}
            activatebutton={true}
          ></FollowCard>
        ))}
      </FollowingList>
    </MainContainer>
  );
}

export default FollowingDisplay;
