import styled from "styled-components";

const MainContainer = styled.div`
  width: 93vw;
  height: 50vh;
  border-color: 2px black solid;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;
const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 50%;
  align-items: center;

  height: 100%;
`;
const Title = styled.h1`
  text-align: center;
  font-size: 2em;
  overflow-wrap: break-word;
  background: linear-gradient(to right, black 79.5%, #eb8736 19.5%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const Description = styled.p`
  text-align: left;
  overflow-wrap: break-word;
  font-weight: 550;
`;
const RewardContainer = styled.div`
  display: flex;
  flex: 1 1 60%;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 80%;
  overflow-x: auto;
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
  <ImageDiv>
    <HtmlImage {...props} />
  </ImageDiv>
))``;

function DescriptionCard(props) {
  return (
    <MainContainer>
      <DescriptionContainer>
        <Title>{props.title}</Title>
        <Description>{props.para1}</Description>
        <Description>{props.para2}</Description>
        <Description>{props.para3}</Description>
        <Description>{props.para4}</Description>
        {props.children}
      </DescriptionContainer>
      <RewardContainer>
        {props.imgs.map((img, index) => {
          return <RewardImage key={index} src={img} />;
        })}
      </RewardContainer>
    </MainContainer>
  );
}

export default DescriptionCard;
