import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../database/auth";
import SignInBtn from "./SignInBtn";
import ProfileBtn from "./ProfileBtn";
import CreateBtn from "./CreateBtn";
import SearchComp from "./SearchComp";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./Theme";
import AppBtn from "./AppBtn/AppBtn";

const MainContainer = styled.nav`
  background-color: ${theme.palette.secondary.main};
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0ex 1ex;
`;

const iconStyles = {
  alignSelf: "stretch"
};

function NavigationBar() {
  const { user } = useAuth();
  return (
    <ThemeProvider theme={ theme }>
      <MainContainer>
        <AppBtn component={ Link } to="/home" color="secondary" dark={true} iconStyles={iconStyles} />
        <SearchComp />
        <CreateBtn />
        { user ? <ProfileBtn /> : <SignInBtn url='/signin' /> }
      </MainContainer>
    </ThemeProvider>
  );
}

export default NavigationBar;
