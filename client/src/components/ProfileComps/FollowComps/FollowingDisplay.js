import styled from "styled-components";
import FollowCard from "./FollowCard";
import { useAuth } from "../../../database/auth";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../../database/const";
import axios from "axios";

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const SubContainer = styled.div`
  width: 30%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 5px 10px #dce0e6;
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
      <SubContainer>
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
      </SubContainer>
    </MainContainer>
  );
}

export default FollowingDisplay;
