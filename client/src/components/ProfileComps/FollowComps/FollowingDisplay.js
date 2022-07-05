import styled from "styled-components";

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
`;

function FollowingDisplay() {
  return (
    <MainContainer>
      <SubContainer>Following Test</SubContainer>
    </MainContainer>
  );
}

export default FollowingDisplay;
