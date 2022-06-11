import { Box, Button, Card, FormControl, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, {keyframes} from "styled-components";
import { useAuth } from "../../database/auth";
import AltSignInComp from "./AltSignInComp";
import EmailComp, { emailBtnText, emailTitle } from "./EmailComp";
import SignInComp, { signInBtnText } from "./SignInComp";
import SignUpComp, { signUpBtnText } from "./SignUpComp";

export const FlexCard = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    padding: 1em 1ex;
    gap: 1em;
`;

export const WideBox = styled(Box)`
    display: flex;
    justify-content: space-between;
    flex-basis: 100%;
    flex-direction: row;
    align-self: stretch;
`;

export const WideBtn = styled(Button)`
    align-self: stretch;
`;

export const WideFormControl = styled(FormControl)`
    align-self: stretch;
`;

const scaleAnimationDown = keyframes`
    0% {
        transform: scale(1, 0);
        transform-origin: center top;
        animation-timing-function: ease-out;
    }
    100% {
        transform: scale(1, 1);
        transform-origin: center top;
    }
`;
export const SignInFormControl = styled(WideFormControl)`
    animation: ${scaleAnimationDown} 0.5s;
    animation-fill-mode: both;
`;
const scaleAnimationUp = keyframes`
    0% {
        transform: scale(1, 0);
        transform-origin: center bottom;
        animation-timing-function: ease-out;
    }
    100% {
        transform: scale(1, 1);
        transform-origin: center bottom;
    }
`;
export const SignUpFormControl = styled(WideFormControl)`
    animation: ${scaleAnimationUp} 0.5s;
    animation-fill-mode: both;
`;

export default function AuthCard() {
    const [ showSignIn, setShowSignIn ] = useState(false);
    const [ showSignUp, setShowSignUp ] = useState(false);

    const { hasUser, signInUserPass, signUpUser } = useAuth();
    const [ givenEmail, setGivenEmail ]  = useState("");
    const [ givenPassword1, setGivenPassword1 ] = useState("");
    const [ givenPassword2, setGivenPassword2 ] = useState("");
    const [ givenName, setGivenName ] = useState("");
    const [ givenAge, setGivenAge ] = useState(-1);
    const [ isPwError, setIsPwError ] = useState(false);
    const pwErrHelperText = "Passwords don't match";
    const navigate = useNavigate();

    const handleEmail = (event) => {
        event.preventDefault();
        checkEmail(givenEmail);
    }

    const checkEmail = async (email) => {
        const isValid = await hasUser(email);
        if (isValid) {
            setShowSignIn(true);
        } else {
            setShowSignUp(true);
        }
    }

    const handleSignIn = (event) => {
        event.preventDefault();
        completeSignInUserPass(givenEmail, givenPassword1);
    };

    const prevPage = () => {
        navigate(-1);
    };

    const completeSignInUserPass = (email, password) => {
        signInUserPass(email, password).then((isSignedIn) => {
            if(isSignedIn) {
                prevPage();
            }
        });
    };

    const handleSignUp = (event) => {
        event.preventDefault();
        const isSuccessful = signUpUser(givenName, givenAge, givenEmail, givenPassword1);
        if (!isSuccessful) {
            console.log('Error while creating user account');
        }
    }

    const handleChangePasswordSignUp = (event, password1Setter, password2) => {
        const password1 = event.target.value;
        password1Setter(password1);
        if (password1 === password2) {
            setIsPwError(false);
        } else {
            setIsPwError(true);
        }
    }

    return (
        <FlexCard 
            component="form" 
            color="secondary" 
            onSubmit={ showSignIn ? handleSignIn : 
                    (showSignUp ? handleSignUp : 
                            handleEmail) } >
            <Typography variant="body1">{ emailTitle }</Typography>
            { showSignUp && (<SignUpComp 
                setName={setGivenName} setAge={setGivenAge} />) }
            <EmailComp setEmail={ setGivenEmail } />
            { (showSignIn) && (<SignInComp 
                setPassword={ setGivenPassword1 }/>) }
            { (showSignUp ) && (
                <>
                    <SignInComp 
                        id="password1"
                        handleChangePassword={(event) => handleChangePasswordSignUp(event, setGivenPassword1, givenPassword2)}
                        isPwError={isPwError} pwErrHelperText={pwErrHelperText}/>
                    <SignInComp 
                        id="password2"
                        label="Re-enter password"
                        handleChangePassword={(event) => handleChangePasswordSignUp(event, setGivenPassword2, givenPassword1)}
                        isPwError={isPwError} pwErrHelperText={pwErrHelperText}/>
                </>
            ) }
            <WideBtn
                id="submit"
                type="submit"
                variant="contained"
                disabled={isPwError}
                color="success">
                { showSignIn ? signInBtnText : 
                        ( showSignUp ? signUpBtnText : 
                                emailBtnText ) }
            </WideBtn>
            <AltSignInComp />
        </FlexCard>
    );
}