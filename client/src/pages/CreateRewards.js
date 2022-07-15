import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../database/auth";
import NavigationBar from "../components/NavBar/NavigationBar";
import CreateRewardCard from "../components/CreateReward/CreateRewardCard";

const MainContainer = styled.div`
  height: 100%;
  width: 100%;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5em;
`;

function CreateRewardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.admin) {
      navigate(-1);
    }
  });

  return (
    <MainContainer>
      <NavigationBar />
      <ContentContainer>
        <CreateRewardCard />
      </ContentContainer>
    </MainContainer>
  );
}

export default CreateRewardPage;
