import { Button, Link, } from "@mui/material";
import { CentredTypo, WideBox } from "./AuthCard";
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
            <CentredTypo variant="body1">OR</CentredTypo>
            <Button variant="contained" startIcon={<GoogleIcon />} onClick={ completeGoogleSignIn }>Sign in with Google</Button>
            <WideBox>
                <Link component={Link} to="#">Can't log in?</Link>
                <Link component={Link} to="#">Create an account</Link>
            </WideBox>
        </>
    );
}