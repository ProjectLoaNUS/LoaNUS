import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  ADMIN,
  CREATE_REWARD,
  HOME,
  VIEW_LISTINGS,
  VIEW_REQUESTS,
} from "../../pages/routes";
import AppBtn from "../NavBar/AppBtn/AppBtn";
import ProfileBtn from "../NavBar/ProfileBtn";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { theme } from "../../utils/Theme";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";

const MyAppBar = styled(AppBar)`
  height: 10vh;
  flex: 0 0 auto;

  & .MuiToolbar-root {
    display: flex;
    height: 100%;
    padding-left: 0;
    padding-right: 1em;
  }
`;
const ContrastBtn = styled(Button)`
  color: ${theme.palette.primary.contrastText};
  border-radius: 0;
`;
const iconStyles = {
  alignSelf: "stretch",
  preserveAspectRatio: "xMaxYMax meet",
};

export default function NavBar(props) {
  const { path } = props;
  const [selectedTab, setSelectedTab] = useState(null);
  const selectedTabStyle = {
    borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
  };

  const checkPath = useCallback(async () => {
    if (path) {
      switch (path) {
        case CREATE_REWARD:
          setSelectedTab(1);
          break;
        case VIEW_LISTINGS:
          setSelectedTab(2);
          break;
        case VIEW_REQUESTS:
          setSelectedTab(3);
          break;
        case ADMIN:
        default:
          setSelectedTab(0);
          break;
      }
    }
  }, [path]);
  useEffect(() => {
    checkPath();
  }, [checkPath]);

  return (
    <MyAppBar position="static">
      <Toolbar>
        <AppBtn
          component={Link}
          to={HOME}
          color="primary"
          dark={true}
          iconStyles={iconStyles}
        />
        <Box sx={{ display: "flex", alignItems: "center", paddingLeft: "1em" }}>
          Admin Portal
          <ArrowRightIcon />
        </Box>
        <Stack
          direction="row"
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: theme.palette.primary.contrastText }}
            />
          }
          spacing={1}
          sx={{ flexGrow: 1 }}
        >
          <ContrastBtn
            onClick={() => setSelectedTab(0)}
            component={Link}
            to={ADMIN}
            sx={selectedTab === 0 ? selectedTabStyle : {}}
          >
            Overview
          </ContrastBtn>
          <ContrastBtn
            onClick={() => setSelectedTab(1)}
            component={Link}
            to={CREATE_REWARD}
            sx={selectedTab === 1 ? selectedTabStyle : {}}
          >
            Add Reward
          </ContrastBtn>
          <ContrastBtn
            onClick={() => setSelectedTab(1)}
            component={Link}
            to={VIEW_LISTINGS}
            sx={selectedTab === 2 ? selectedTabStyle : {}}
          >
            View all listings
          </ContrastBtn>
          <ContrastBtn
            onClick={() => setSelectedTab(1)}
            component={Link}
            to={VIEW_REQUESTS}
            sx={selectedTab === 3 ? selectedTabStyle : {}}
          >
            View all requests
          </ContrastBtn>
        </Stack>
        <ProfileBtn />
      </Toolbar>
    </MyAppBar>
  );
}
