import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import AppIcon from "../components/NavBar/AppBtn/AppIcon";
import AuthCard from "../components/SignInComps/AuthCard";
import NotSignedInToast from "../components/SignInComps/NotSignedInToast";

const ContainerStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5vh;
  flex-direction: column;
  min-height: 100vh;
  background-color: aliceblue;
`;

const FlexBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function SignInPage() {
  const { state } = useLocation();

  return (
    <ContainerStyle>
      <FlexBox>
        <AppIcon dark={false} iconStyles={{height: "15vh"}}/>
        <Typography variant="h3">LoaNUS</Typography>
      </FlexBox>
      <AuthCard />
      <NotSignedInToast open={state.open} />
    </ContainerStyle>
  );
}

export default SignInPage;
