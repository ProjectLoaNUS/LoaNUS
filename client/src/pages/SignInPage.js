import { Box, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AppIcon from "../components/NavBar/AppBtn/AppIcon";
import AuthCard from "../components/SignInComps/AuthCard";
import NotSignedInToast from "../components/SignInComps/NotSignedInToast";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

const ContainerStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-height: 100vh;
  background-color: aliceblue;
`;

const TopBar = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 1rem;
  align-items: center;
  flex: 0 0 auto;
`;

const BodyContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const FlexBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TitleText = styled.h1`
  color: black;
  font-size: 3.5vw;
  float: left;
  margin: 0;
`;
const TitleText2 = styled.h1`
  color: #eb8736;
  font-size: 3.5vw;
  float: right;
  margin: 0;
`;
const TitleContainer = styled.div`
  display: inline-block;
  text-align: center;
  min-height: 50px;
  overflow: hidden;
`;

function SignInPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const backToHome = () => {
    navigate("/");
  };

  return (
    <ContainerStyle>
      <TopBar>
        <Button
          color="primary"
          variant="contained"
          onClick={backToHome}
          startIcon={<ArrowLeftIcon />}
        >
          Home
        </Button>
      </TopBar>
      <BodyContainer>
        <FlexBox>
          <AppIcon dark={false} iconStyles={{ height: "15vh" }} />
          <TitleContainer>
            <TitleText>Loa</TitleText>
            <TitleText2>NUS</TitleText2>
          </TitleContainer>
        </FlexBox>
        <AuthCard />
        <NotSignedInToast
          open={state && state.open}
          message={state && state.message}
        />
      </BodyContainer>
    </ContainerStyle>
  );
}

export default SignInPage;
