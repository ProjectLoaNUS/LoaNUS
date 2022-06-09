import { Box, Button, Card, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Typography } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import styled from "styled-components";
import { useAuth } from "../../database/auth";
import { VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';

const FlexCard = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    padding: 1em 1ex;
    gap: 1em;
`;

const WideBox = styled(Box)`
    display: flex;
    justify-content: space-between;
    flex-basis: 100%;
    flex-direction: row;
    align-self: stretch;
`;

const WideBtn = styled(Button)`
    align-self: stretch;
`;

const WideFormControl = styled(FormControl)`
    align-self: stretch;
`;

export default function SignInCard() {
    const { signInWithGoogle, signInUserPass } = useAuth();
    const [ givenUsername, setGivenUsername ]  = useState("");
    const [ givenPassword, setGivenPassword ] = useState("");
    const [values, setValues] = useState({
        showPassword: false,
    });
    const navigate = useNavigate();

    const handleSignIn = (event) => {
        event.preventDefault();
        completeSignInUserPass(givenUsername, givenPassword);
    };
    
    const handleClickShowPassword = () => {
        setValues({
            showPassword: !values.showPassword,
        });
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const asyncSignInGoogle = () => async () => signInWithGoogle();

    const prevPage = () => {
        navigate(-1);
    };

    const completeGoogleSignIn = () => {
        asyncSignInGoogle()().then(() => {
            prevPage();
        });
    };

    const asyncSignInUserPass = (username, password) => async () => signInUserPass(username, password);

    const completeSignInUserPass = (username, password) => {
        asyncSignInUserPass(username, password)().then((isSignedIn) => {
            if(isSignedIn) {
                prevPage();
            }
        });
    };

    return (
      <FlexCard component="form" color="secondary" onSubmit={handleSignIn}>
          <Typography variant="body1">Log in to your account</Typography>
          <WideFormControl required variant="outlined">
              <InputLabel htmlFor="username">Email/Username</InputLabel>
              <OutlinedInput
                required
                id="username"
                variant="outlined"
                label="Email/Username"
                onChange={(event) => setGivenUsername(event.target.value)} />
          </WideFormControl>
          <WideFormControl required variant="outlined">
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type={values.showPassword ? "text" : "password"}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end">
                              {values.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                    </InputAdornment>
                }
                label="Password"
                onChange={(event) => setGivenPassword(event.target.value)} />
          </WideFormControl>
          <WideBtn
            id="signin"
            type="submit"
            variant="contained"
            color="success">Sign In</WideBtn>
          <Typography variant="body1">OR</Typography>
          <WideBtn variant="contained" startIcon={<GoogleIcon />} onClick={ completeGoogleSignIn }>Sign in with Google</WideBtn>
          <WideBox>
              <Link component={Link} to="#">Can't log in?</Link>
              <Link component={Link} to="#">Create an account</Link>
          </WideBox>
      </FlexCard>  
    );
}