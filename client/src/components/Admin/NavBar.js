import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { CREATE_REWARD, HOME } from "../../pages/routes";
import AppBtn from "../NavBar/AppBtn/AppBtn";
import ProfileBtn from "../NavBar/ProfileBtn";
import { theme } from "../Theme";

const MyAppBar = styled(AppBar)`
  height: 10vh;

  & .MuiToolbar-root {
    display: flex;
    height: 100%;
  }
`
const ContrastBtn = styled(Button)`
  color: ${theme.palette.primary.contrastText};
`;
const iconStyles = {
    alignSelf: "stretch",
    preserveAspectRatio: "xMaxYMax meet"
};

export default function NavBar() {
    return (
        <MyAppBar position="static">
            <Toolbar>
                <AppBtn
                  component={Link}
                  to={HOME}
                  color="primary"
                  dark={true}
                  iconStyles={iconStyles} />
                <Box sx={{display: "flex", flexGrow: "1"}}>
                    <ContrastBtn>Overview</ContrastBtn>
                    <ContrastBtn component={Link} to={CREATE_REWARD}>Add Reward</ContrastBtn>
                </Box>
                <ProfileBtn />
            </Toolbar>
        </MyAppBar>
    );
}