import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AppIcon from "../components/AppBtn/AppIcon";
import AuthCard from "../components/SignInComps/AuthCard";

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

function SignInPage() {
  const navigate = useNavigate();

  const backToHome = () => {
    navigate("/");
  }

  return (
    <ContainerStyle>
      <TopBar>
        <Button color="primary" variant="outlined" onClick={backToHome}>Back to Home</Button>
      </TopBar>
      <BodyContainer>
        <FlexBox>
          <AppIcon dark={false} iconStyles={{height: "15vh"}}/>
          <Typography variant="h3">LoaNUS</Typography>
        </FlexBox>
        <AuthCard />
      </BodyContainer>
    </ContainerStyle>
  );
}

export default SignInPage;
