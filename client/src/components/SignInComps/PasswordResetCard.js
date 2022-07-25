import styled from "styled-components";
import { useState, useEffect } from "react";
import { Card, TextField } from "@mui/material";
import ButtonComponent from "../../utils/Button";
import SignInComp from "./SignInComp";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";
import { useLocation, useNavigate } from "react-router-dom";

const Title = styled.h1`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const Paragraph = styled.p`
  overflow-wrap: break-word;
  text-align: start;
`;

const FlexCard = styled(Card)`
  display: flex;
  max-width: 25vw;
  flex-direction: column;
  align-items: stretch;
  align-self: center;
  padding: 1em 1ex;

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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5vh;
  justify-content: space-evenly;
`;
const Space = styled.div`
  width: 100%;
  height: 30px;
`;

function PasswordResetCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;
  const [otp, setOtp] = useState(null);
  const [storedotp, setStoredOtp] = useState(null);
  const [givenPassword1, setGivenPassword1] = useState("");
  const [givenPassword2, setGivenPassword2] = useState("");
  const [isPwError, setIsPwError] = useState(false);
  const [verified, setVerified] = useState(false);

  const handlesavepassword = () => {
    if (!isPwError) {
      const data = {
        email: email,
        newpassword: givenPassword1,
      };
      axios.post(`${BACKEND_URL}/api/user/changepassword`, data);
      navigate("/signin");
    }
  };

  const handleOtpsubmit = () => {
    if (otp == storedotp) {
      setVerified(true);
    }
  };

  const handlesendagain = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const data = {
      email: email,
      otp: otp,
    };
    axios.post(`${BACKEND_URL}/api/user/createotp`, data);
  };

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/user/getotp?email=` + email)
      .then((res) => setStoredOtp(res.data.otp));
  }, []);

  return (
    <>
      {verified ? (
        <FlexCard>
          <Title>Create new password</Title>
          <Paragraph>Fill in below to save your new password</Paragraph>

          <SignInComp
            id="password1"
            isPwError={isPwError}
            otherPw={givenPassword2}
            setIsPwError={setIsPwError}
            setPassword={setGivenPassword1}
          />
          <Space></Space>
          <SignInComp
            id="password2"
            label="Re-enter password"
            isPwError={isPwError}
            otherPw={givenPassword1}
            setIsPwError={setIsPwError}
            setPassword={setGivenPassword2}
          />

          <ButtonContainer>
            <ButtonComponent
              size="small"
              disabled={isPwError}
              text="save changes"
              state="primary"
              onClick={handlesavepassword}
            ></ButtonComponent>
          </ButtonContainer>
        </FlexCard>
      ) : (
        <FlexCard>
          <Title>Verification Required</Title>
          <Paragraph>
            To continue, complete this verification step. We've sent a One Time
            Password (OTP) to the email {email}. Please enter it below
          </Paragraph>
          <TextField
            id="outlined-basic"
            label="OTP"
            variant="outlined"
            type="number"
            size="medium"
            onChange={(event) => setOtp(event.target.value)}
          />
          <ButtonContainer>
            <ButtonComponent
              size="small"
              text="resend otp"
              onClick={handlesendagain}
            ></ButtonComponent>
            <ButtonComponent
              size="small"
              text="confirm"
              state="primary"
              onClick={handleOtpsubmit}
            ></ButtonComponent>
          </ButtonContainer>
        </FlexCard>
      )}
    </>
  );
}

export default PasswordResetCard;
