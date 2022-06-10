import { Button, Card, FormControl, InputLabel, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import { useAuth } from '../../database/auth';
import styled from "styled-components";
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FlexCard = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    padding: 1em 1ex;
    gap: 1em;
`;

const WideFormControl = styled(FormControl)`
    align-self: stretch;
`;

const WideBtn = styled(Button)`
    align-self: stretch;
`;

export default function SignUpCard() {
    const { hasUser, signInWithGoogle, signInUserPass, signUpUser } = useAuth();
    const [ givenName, setGivenName ] = useState("");
    const [ givenAge, setGivenAge ] = useState(-1);
    const [ givenUsername, setGivenUsername ]  = useState("");
    const [ givenPassword, setGivenPassword ] = useState("");
    const [values, setValues] = useState({
        showPassword: false,
    });
    const navigate = useNavigate();

    const handleSignUp = (event) => {
        event.preventDefault();
        const isSuccessful = signUpUser(givenName, givenAge, givenUsername, givenPassword);
        if (!isSuccessful) {
            console.log('Error while creating user account');
        }
    }

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

    return (
        <FlexCard component="form" color="secondary" onSubmit={handleSignUp}>
            <Typography variant="body1">Log in to your account</Typography>
            <WideFormControl required variant="outlined">
                <InputLabel htmlFor="name">Your name</InputLabel>
                <OutlinedInput
                  required
                  id="name"
                  variant="outlined"
                  label="Your name"
                  onChange={(event) => setGivenName(event.target.value)} />
            </WideFormControl>
            <WideFormControl required variant="outlined">
                <InputLabel htmlFor="age">Your age</InputLabel>
                <OutlinedInput
                  required
                  id="age"
                  variant="outlined"
                  label="Your age"
                  onChange={(event) => setGivenAge(event.target.value)} />
            </WideFormControl>
            <WideFormControl required variant="outlined">
                <InputLabel htmlFor="username">Username</InputLabel>
                <OutlinedInput
                  required
                  id="username"
                  variant="outlined"
                  label="Username"
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
              id="signup"
              type="submit"
              variant="contained"
              color="success">Sign Up</WideBtn>
            <Typography variant="body1">OR</Typography>
            <WideBtn variant="contained" startIcon={<GoogleIcon />} onClick={ completeGoogleSignIn }>Sign in with Google</WideBtn>
        </FlexCard>  
      );
}