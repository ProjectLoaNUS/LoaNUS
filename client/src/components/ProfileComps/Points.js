import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ButtonComponent from "../../utils/Button";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../database/const";
import { useAuth } from "../../database/auth";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CLAIM_REWARD } from "../../pages/routes";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../utils/jwt-config";

const CoinsContainer = styled.div`
  align-self: center;
  border: 1px solid #c9c9c9;
  border-radius: 7px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px;
  align-items: center;
  padding: 1rem 1ch;
  gap: 1ch;
`;
const StyledCoin = styled(CurrencyExchangeIcon)`
  color: #2d3c4a;
  margin-right: 10px;
  transform: scale(1.5);
  margin-left: 5px;
`;

export default function Points() {
  const [points, setPoints] = useState("...");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && points === "...") {
      const token = jwt.sign(
        {id: user.id},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
      );
      fetch(`${BACKEND_URL}/api/user/getPoints`, {
        method: "GET",
        headers: {
          "x-auth-token": token
        }
      })
        .then((req) => {
          req.json().then(data => {
            if (req.status === 200) {
              setPoints(data.points);
            } else {
              console.log(data.error);
            }
          });
        });
    }
  }, [user]);

  const onClickSpend = () => {
    navigate(CLAIM_REWARD);
  };

  return (
    <>
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: "bold", marginTop: "1rem" }}
      >
        LoaNUS Coins
      </Typography>
      <CoinsContainer>
        <StyledCoin></StyledCoin>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {points} Coins
        </Typography>

        <ButtonComponent
          size={"small"}
          text={"Spend coins"}
          onClick={onClickSpend}
          state={"primary"}
          setHeight={"15px"}
        />
      </CoinsContainer>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ fontStyle: "italic" }}
      >
        Lend some items to others on LoaNUS to earn coins and redeem rewards!
      </Typography>
    </>
  );
}
