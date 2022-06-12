import { Button } from "@mui/material";
import { CentredTypo, GapFormDiv } from "./AuthCard";
import GoogleIcon from '@mui/icons-material/Google'
import { useAuth } from "../../database/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../Theme";

const AltSignInDiv = styled(GapFormDiv)`
    align-items: stretch;
    & .MuiLink-root {
        color: ${theme.palette.accent.main};
        text-decoration-color: ${theme.palette.accent.main};
    }
`;

export default function AltSignInComp() {
    const { signInWithGoogle } = useAuth();
    const asyncSignInGoogle = () => async () => signInWithGoogle();
    const navigate = useNavigate();

    const prevPage = () => {
        navigate(-1);
    };

    const completeGoogleSignIn = () => {
        asyncSignInGoogle()().then(() => {
            prevPage();
        });
    };

    return (
        <AltSignInDiv>
            <CentredTypo variant="body1">OR</CentredTypo>
            <Button variant="outlined" color="info" startIcon={<GoogleIcon />} onClick={ completeGoogleSignIn }>Sign in with Google</Button>
        </AltSignInDiv>
    );
}