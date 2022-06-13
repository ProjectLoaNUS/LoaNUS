import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../database/auth";
import SignInBtn from "../SignInComps/SignInBtn";
import ProfileBtn from "./ProfileBtn";
import CreateBtn from "./CreateBtn";
import SearchBar from "../SearchBar/SearchBar";
import { theme } from "../Theme";
import AppBtn from "./AppBtn/AppBtn";

const MainContainer = styled.nav`
  background-color: ${theme.palette.primary.main};
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
      <MainContainer>
        <AppBtn component={ Link } to="/home" color="primary" dark={true} iconStyles={iconStyles} />
        <SearchBar />
        <CreateBtn />
        { user ? <ProfileBtn /> : <SignInBtn url='/signin' /> }
      </MainContainer>
  );
}

export default NavigationBar;
