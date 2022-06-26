import styled from "styled-components";

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

function DescriptionCard(props) {
  return (
    <MainContainer>
      <DescriptionContainer>
        <Title>{props.title}</Title>
        <Description>
          {props.desc}
        </Description>
        {props.children}
      </DescriptionContainer>
      <RewardContainer>
        {props.imgs.map((img, index) => {
          return <RewardImage key={index} src={img} />
        })}
      </RewardContainer>
    </MainContainer>
  );
}

export default DescriptionCard;
