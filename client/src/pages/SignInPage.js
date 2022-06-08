import { Box, Typography } from "@mui/material";
import styled from "styled-components";
import AppIcon from "../components/AppBtn/AppIcon";
import SignInCard from "../components/SignInCard";

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

  return (
    <ContainerStyle>
      <FlexBox>
        <AppIcon dark={false} iconStyles={{height: "15vh"}}/>
        <Typography variant="h3">LoaNUS</Typography>
      </FlexBox>
      <SignInCard />
    </ContainerStyle>
  );
}

export default SignInPage;
