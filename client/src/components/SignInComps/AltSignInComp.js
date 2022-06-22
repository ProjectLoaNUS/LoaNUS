import { Button } from "@mui/material";
import { CentredTypo } from "./AuthCard";
import GoogleIcon from '@mui/icons-material/Google'
import { useAuth } from "../../database/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../Theme";
import { CentredDiv } from "../FlexDiv";

const AltSignInDiv = styled(CentredDiv)`
    display: flex;
    flex-direction: column;
    align-self: stretch;
    align-items: stretch;
    gap: 1rem;
    & .MuiLink-root {
        color: ${theme.palette.secondary.main};
        text-decoration-color: ${theme.palette.secondary.main};
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