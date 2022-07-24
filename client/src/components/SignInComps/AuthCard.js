import {
  Box,
  Button,
  Card,
  Fade,
  FormHelperText,
  Grow,
  Typography,
  Zoom,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import {
  hasUserResultCodes,
  hasUserResultTexts,
  signInResultCodes,
  signInResultTexts,
  useAuth,
} from "../../database/auth";
import AltSignInComp from "./AltSignInComp";
import EmailComp, { emailBtnText, emailTitle } from "./EmailComp";
import SignInComp, { signInBtnText } from "./SignInComp";
import SignUpComp, { signUpBtnText } from "./SignUpComp";
import { TransitionGroup } from "react-transition-group";
import { CentredDiv } from "../FlexDiv";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";

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
  & .MuiFormControl-root {
    align-self: stretch;
  }
`;

const FormDiv = styled(CentredDiv)`
  flex-direction: column;
  align-self: stretch;
`;

export const GapFormDiv = styled(FormDiv)`
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

const AccentLink = styled(Link)`
  color: #eb8736;
  text-decoration-color: #eb8736;
  text-align: right;
  align-self: end;
`;

export const CentredTypo = styled(Typography)`
  text-align: center;
`;

export default function AuthCard() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const { hasUser, signInUserPass, signUpUser } = useAuth();
  const [givenEmail, setGivenEmail] = useState("");
  const [givenPassword1, setGivenPassword1] = useState("");
  const [givenPassword2, setGivenPassword2] = useState("");
  const [givenName, setGivenName] = useState("");
  const [givenAge, setGivenAge] = useState(-1);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isFormError, setIsFormError] = useState(false);
  const [isPwError, setIsPwError] = useState(false);
  const [isSubmitErr, setIsSubmitErr] = useState(false);
  const [submitErrHelperText, setSubmitErrHelperText] = useState("");
  const cardRef = useRef(null);
  const navigate = useNavigate();

  const handleEmail = (event) => {
    event.preventDefault();
    checkEmail(givenEmail);
  };

  const checkEmail = async (email) => {
    const userStatus = await hasUser(email);
    switch (userStatus) {
      case hasUserResultCodes.HAS_USER:
        setShowSignIn(true);
        break;
      case hasUserResultCodes.NO_SUCH_USER:
        setShowSignUp(true);
        break;
      case hasUserResultCodes.UNVERIFIED_USER:
        setSubmitErrHelperText(hasUserResultTexts[userStatus]);
        setIsSubmitErr(true);
        break;
      case hasUserResultCodes.UNKNOWN_ERROR:
      default:
        setSubmitErrHelperText(hasUserResultTexts[userStatus]);
        setIsSubmitErr(true);
        break;
    }
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    completeSignInUserPass(givenEmail, givenPassword1);
  };

  const homePage = () => {
    navigate("/");
  };

  const completeSignInUserPass = (email, password) => {
    signInUserPass(email, password).then((resultCode) => {
      switch (resultCode) {
        case signInResultCodes.SUCCESS:
          homePage();
          break;
        case signInResultCodes.INVALID_PASSWORD:
        case signInResultCodes.NO_SUCH_USER:
        case signInResultCodes.UNKNOWN:
        case signInResultCodes.EMAIL_NOT_VERIFIED:
          setSubmitErrHelperText(signInResultTexts[resultCode]);
          setIsSubmitErr(true);
          break;
        default:
          setSubmitErrHelperText("Unknown error occurred");
          setIsSubmitErr(true);
          break;
      }
    });
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const isSuccessful = await signUpUser(
      givenName,
      givenAge,
      givenEmail,
      givenPassword1
    );
    if (!isSuccessful) {
      setSubmitErrHelperText("Error while creating user account");
      setIsSubmitErr(true);
    } else {
      setSubmitErrHelperText(
        "Email sent! Please verify the account to sign in"
      );
      setShowSignUp(false);
      setShowSignIn(true);
    }
  };

  const handlepassword = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const data = {
      email: givenEmail,
      otp: otp,
    };
    axios.post(`${BACKEND_URL}/api/user/createotp`, data);
  };

  useEffect(() => {
    if (isPwError || isEmailError) {
      setIsFormError(true);
    } else {
      if (isFormError) {
        setIsFormError(false);
      }
    }
  }, [isEmailError, isFormError, isPwError]);

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
      onSubmit={
        showSignIn ? handleSignIn : showSignUp ? handleSignUp : handleEmail
      }
      ref={cardRef}
    >
      <CentredTypo variant="body1">{emailTitle}</CentredTypo>
      <TransitionGroup>
        {showSignUp && (
          <GrowUp timeout={500}>
            <GapFormDiv>
              <SignUpComp
                setName={setGivenName}
                setAge={setGivenAge}
                showSignUp={showSignUp}
              />
            </GapFormDiv>
          </GrowUp>
        )}
        <EmailComp
          isEmailError={isEmailError}
          setEmail={setGivenEmail}
          setIsEmailError={setIsEmailError}
          setIsPwError={setIsPwError}
        />
        {(showSignIn || showSignUp) && (
          <GrowDown timeout={1000}>
            <FormDiv>
              <SignInComp
                id="password1"
                isPwError={isPwError}
                otherPw={showSignUp && givenPassword2}
                setIsPwError={showSignUp && setIsPwError}
                setPassword={setGivenPassword1}
              />
              {showSignIn && (
                <AccentLink
                  onClick={handlepassword}
                  to="/password-reset"
                  state={{ email: givenEmail }}
                >
                  Can't log in?
                </AccentLink>
              )}
            </FormDiv>
          </GrowDown>
        )}
        {showSignUp && (
          <GrowDown timeout={1000}>
            <FormDiv>
              <SignInComp
                id="password2"
                label="Re-enter password"
                isPwError={isPwError}
                otherPw={givenPassword1}
                setIsPwError={setIsPwError}
                setPassword={setGivenPassword2}
              />
            </FormDiv>
          </GrowDown>
        )}
        {showSignUp && (
          <Fade timeout={{ appear: 1000, enter: 1000, exit: 0 }}>
            <WideBox>
              <GrowBtn
                id="sign-in"
                variant="outlined"
                color="success"
                onClick={() => {
                  setIsPwError(false);
                  setShowSignIn(true);
                  setShowSignUp(false);
                }}
              >
                Sign In
              </GrowBtn>
              <GrowBtn
                id="submit"
                type="submit"
                variant="contained"
                disabled={isFormError}
                color="success"
              >
                {signUpBtnText}
              </GrowBtn>
            </WideBox>
          </Fade>
        )}
        {!showSignUp && (
          <Fade
            appear={false}
            style={{ transitionDelay: showSignUp ? "-1000ms" : "750ms" }}
            timeout={{ enter: 1000, exit: 0 }}
          >
            <Button
              id="submit"
              type="submit"
              variant="contained"
              disabled={isFormError}
              color="success"
            >
              {showSignIn ? signInBtnText : emailBtnText}
            </Button>
          </Fade>
        )}
        {!!submitErrHelperText && (
          <Zoom
            style={{ transitionDelay: isSubmitErr ? "0ms" : "750ms" }}
            timeout={isSubmitErr ? 500 : 1000}
          >
            <FormHelperText id="errorHelper" error={isSubmitErr}>
              {submitErrHelperText}
            </FormHelperText>
          </Zoom>
        )}
      </TransitionGroup>
      <AltSignInComp />
    </FlexCard>
  );
}
