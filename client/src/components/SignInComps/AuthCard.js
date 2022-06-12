import { Box, Button, Card, Fade, FormHelperText, Grow, Slide, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signInResultCodes, signInResultTexts, useAuth } from "../../database/auth";
import AltSignInComp from "./AltSignInComp";
import EmailComp, { emailBtnText, emailTitle } from "./EmailComp";
import SignInComp, { signInBtnText } from "./SignInComp";
import SignUpComp, { signUpBtnText } from "./SignUpComp";
import { TransitionGroup } from 'react-transition-group';
import { CentredDiv } from "../FlexDiv";

export const FlexCard = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    align-self: center;
    padding: 1em 1ex;
    gap: 1rem;
    div:empty {
        margin: -1rem 0rem 0rem;
    }
    div:not([class]) {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        align-self: center;
        gap: 1rem;
    }
    p {
        text-align: center;
    }
`;

const FormDiv = styled(CentredDiv)`
    flex-direction: column;
    align-self: stretch;
    gap: 1rem;
`;

export const WideBox = styled(Box)`
    display: flex;
    justify-content: space-between;
    flex-basis: 100%;
    flex-direction: row;
    column-gap: 1ch;
`;

const GrowBtn = styled(Button)`
    flex: 1 1 auto;
`;

const GrowUp = styled(Grow)`
    transform-origin: center bottom;
`;

const GrowDown = styled(Grow)`
    transform-origin: center top;
`;

const GrowRight = styled(Grow)`
    transform-origin: left center;
`

export const CentredTypo = styled(Typography)`
    text-align: center;
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
    const [ isEmailError, setIsEmailError ] = useState(false);
    const [ isFormError, setIsFormError ] = useState(false);
    const [ isPwError, setIsPwError ] = useState(false);
    const [ isSubmitErr, setIsSubmitErr ] = useState(false);
    const [ submitErrHelperText, setSubmitErrHelperText ] = useState("");
    const cardRef = useRef(null);
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
        signInUserPass(email, password).then((resultCode) => {
            switch(resultCode) {
                case signInResultCodes.SUCCESS:
                    prevPage();
                    break;
                case signInResultCodes.INVALID_PASSWORD:
                case signInResultCodes.NO_SUCH_USER:
                case signInResultCodes.UNKNOWN:
                    setSubmitErrHelperText(signInResultTexts[resultCode]);
                    setIsSubmitErr(true);
                    break;
            }
        });
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        const isSuccessful = await signUpUser(givenName, givenAge, givenEmail, givenPassword1);
        if (!isSuccessful) {
            setSubmitErrHelperText("Error while creating user account");
            setIsSubmitErr(true);
        } else {
            setSubmitErrHelperText("Account created! Log in now");
            setShowSignUp(false);
            setShowSignIn(true);
        }
    }

    useEffect(() => {
        if (isPwError || isEmailError) {
            setIsFormError(true);
        } else {
            if (isFormError) {
                setIsFormError(false);
            }
        }
    }, [isEmailError, isFormError, isPwError]);

    return (
        <FlexCard 
            component="form" 
            color="secondary" 
            onSubmit={ showSignIn ? handleSignIn : 
                    (showSignUp ? handleSignUp : 
                            handleEmail) }
            ref={cardRef}>
            <CentredTypo variant="body1">{ emailTitle }</CentredTypo>
            <TransitionGroup>
                { showSignUp &&
                    <GrowUp timeout={500}>
                        <FormDiv>
                            <SignUpComp 
                                setName={setGivenName} setAge={setGivenAge} showSignUp={showSignUp} />
                        </FormDiv>
                    </GrowUp>}
                <EmailComp
                    isEmailError={isEmailError}
                    setEmail={ setGivenEmail }
                    setIsEmailError={setIsEmailError}
                    setIsPwError={setIsPwError} />
                { (showSignIn || showSignUp) && 
                    <GrowDown timeout={1000}>
                        <FormDiv>
                            <SignInComp 
                                id="password1"
                                isPwError={isPwError}
                                otherPw={showSignUp && givenPassword2}
                                setIsPwError={showSignUp && setIsPwError}
                                setPassword={setGivenPassword1} /> 
                        </FormDiv>
                    </GrowDown> }
                { showSignUp &&
                    <GrowDown timeout={1000}>
                        <FormDiv>
                            <SignInComp 
                                id="password2"
                                label="Re-enter password"
                                isPwError={isPwError}
                                otherPw={givenPassword1}
                                setIsPwError={setIsPwError}
                                setPassword={setGivenPassword2} />
                        </FormDiv>
                    </GrowDown> }
                { showSignUp && 
                    (<Fade timeout={{appear: 1000, enter: 1000, exit: 0}}>
                        <WideBox>
                            <GrowBtn
                                id="sign-in"
                                variant="outlined"
                                color="success"
                                onClick={() => {
                                    setShowSignIn(true);
                                    setShowSignUp(false);
                                }}>
                                Sign In
                            </GrowBtn>
                            <GrowBtn
                                id="submit"
                                type="submit"
                                variant="contained"
                                disabled={isFormError}
                                color="success">
                                    { signUpBtnText }
                            </GrowBtn>
                        </WideBox>
                    </Fade>) }
                { !showSignUp &&
                    (<Fade appear={false} style={{transitionDelay: showSignUp ? '-1000ms' : '750ms'}} timeout={{enter: 1000, exit: 0}}>
                        <Button
                            id="submit"
                            type="submit"
                            variant="contained"
                            disabled={isFormError}
                            color="success">
                            { showSignIn ? signInBtnText :  emailBtnText }
                        </Button>
                    </Fade>) }
                { !!submitErrHelperText && 
                    (<Slide direction="right" container={cardRef.current}>
                        <FormHelperText id="errorHelper" error={isSubmitErr}>{submitErrHelperText}</FormHelperText>
                    </Slide>) }
            </TransitionGroup>
            <AltSignInComp />
        </FlexCard>
    );
}