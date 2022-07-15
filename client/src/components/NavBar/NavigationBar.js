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
import { AppBar, Stack, Toolbar } from "@mui/material";
import { HOME } from "../../pages/routes";

const MyAppBar = styled(AppBar)`
  height: 10vh;

  & .MuiToolbar-root {
    display: flex;
    height: 100%;
    align-items: center;
    ustify-content: space-between;
    padding: 0ex 1ex;
    gap: 1ex;
  }
`;

const iconStyles = {
  alignSelf: "stretch"
};

function NavigationBar() {
  const { user } = useAuth();
  return (
    <MyAppBar position="static">
      <Toolbar>
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
      </Toolbar>
    </MyAppBar>
  );
}

export default NavigationBar;
