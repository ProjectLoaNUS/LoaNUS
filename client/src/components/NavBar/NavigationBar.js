import styled from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../database/auth";
import SignInBtn from "./SignInBtn";
import ProfileBtn from "./ProfileBtn";
import CreateBtn from "./CreateBtn";
import SearchBar from "../SearchBar/SearchBar";
import { theme } from "../Theme";
import AppBtn from "./AppBtn/AppBtn";
import ChatBtn from "./ChatBtn";
import { Stack } from "@mui/material";
import { HOME } from "../../pages/routes";

const MainContainer = styled.nav`
  background-color: ${theme.palette.primary.main};
  height: 10vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0ex 1ex;
  gap: 1ex;
`;

const iconStyles = {
  alignSelf: "stretch"
};

function NavigationBar() {
  const { user } = useAuth();
  return (
      <MainContainer>
        <AppBtn
          component={Link}
          to={HOME}
          color="primary"
          dark={true}
          iconStyles={iconStyles} />
        <SearchBar />
        { user ?
          <Stack direction="row">
            <CreateBtn />
            <ChatBtn />
            <ProfileBtn />
          </Stack>
        :
          <SignInBtn url='/signin' />
        }
      </MainContainer>
  );
}

export default NavigationBar;
