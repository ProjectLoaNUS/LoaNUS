import { Link, Typography } from "@mui/material";
import { WideBtn, WideBox } from "./AuthCard";
import GoogleIcon from '@mui/icons-material/Google'
import { useAuth } from "../../database/auth";
import { useNavigate } from "react-router-dom";

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
        <>
            <Typography variant="body1">OR</Typography>
            <WideBtn variant="contained" startIcon={<GoogleIcon />} onClick={ completeGoogleSignIn }>Sign in with Google</WideBtn>
            <WideBox>
                <Link component={Link} to="#">Can't log in?</Link>
                <Link component={Link} to="#">Create an account</Link>
            </WideBox>
        </>
    );
}