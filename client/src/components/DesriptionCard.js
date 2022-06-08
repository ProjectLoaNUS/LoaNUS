import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ButtonComponent from "./Button";
import Bubbletea from "../assets/BubbleTea.png";
import Coffee from "../assets/Coffee.jpg";

const MainContainer = styled.div`
  width: 80vw;
  height: 40vh;
  border-color: 2px black solid;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 100px;
`;
const ImageContainer = styled.div`
  width: 60%;
`;
const DescriptionContainer = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.h1`
  text-align: center;
  font-size: 1.5em;
`;
const Description = styled.p`
  text-align: center;
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const RewardContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const RewardImage = styled.img`
  width: 50%;
  height: 100px;
`;

function InformationContainer() {
  const navigate = useNavigate();
  return (
    <MainContainer>
      <DescriptionContainer>
        <Title>Earn rewards and make a friend</Title>
        <Description>
          Do you own items which you seldom use? Loan it to your peers to earn
          attractive rewards and make a potential friend!
        </Description>
        <ButtonContainer>
          <ButtonComponent
            state={"primary"}
            onClick={() => {
              navigate("/view-rewards");
            }}
            text={"View Rewards"}
          ></ButtonComponent>
          <ButtonComponent
            onClick={() => {
              navigate("/create-request");
            }}
            text={"Create Request"}
          ></ButtonComponent>
        </ButtonContainer>
      </DescriptionContainer>
      <ImageContainer>
        <RewardContainer>
          <RewardImage src={Bubbletea}></RewardImage>
          <RewardImage src={Coffee}></RewardImage>
        </RewardContainer>
      </ImageContainer>
    </MainContainer>
  );
}

export default InformationContainer;
