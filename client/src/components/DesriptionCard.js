import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ButtonComponent from "./Button";
import Bubbletea from "../assets/BubbleTea.png";
import Coffee from "../assets/Coffee.jpg";
import { Stack } from "@mui/material";

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
const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 40%;
  align-items: center;
`;
const Title = styled.h1`
  text-align: center;
  font-size: 1.5em;
  overflow-wrap: break-word;
`;
const Description = styled.p`
  text-align: center;
  overflow-wrap: break-word;
`;
const ButtonContainer = styled(Stack)`
  display: flex;
  flex-direction: row;
`;
const RewardContainer = styled.div`
  display: flex;
  flex: 1 1 60%;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 80%;
`;
const HtmlImage = styled.img`
  width: 100%;
  object-fit: contain;
`;
const ImageDiv = styled.div`
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
`;
const RewardImage = styled((props) => (
    <ImageDiv><HtmlImage {...props} /></ImageDiv>
))``;

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
        <ButtonContainer direction="row">
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
      <RewardContainer>
        <RewardImage src={Bubbletea}></RewardImage>
        <RewardImage src={Coffee}></RewardImage>
      </RewardContainer>
    </MainContainer>
  );
}

export default InformationContainer;
