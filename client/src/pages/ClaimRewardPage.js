import styled from "styled-components";
import { useState, useEffect } from "react";
import NavigationBar from "../components/NavBar/NavigationBar";
import RewardCard from "../components/RewardComps/RewardCard";
import axios from "axios";
import { BACKEND_URL } from "../database/const";
import { useAuth } from "../database/auth";
import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { theme } from "../utils/Theme";
import LoadingRewardCards from "../components/RewardComps/LoadingRewardCards";
import LoadingRewardCard from "../components/RewardComps/LoadingRewardCard";

const MainContainer = styled.div`
  background-color: #fafdf3;
  width: 100%;
  height: 100%;
`;
const BelowNavBarContainer = styled.div`
  width: 100%;

  flex-direction: column;
  display: flex;

  align-items: center;
`;
const HeaderContainer = styled.div`
  font-size: 4vh;
  align-self: center;
  color: #eb8736;

  font-weight: 550;
`;
const RewardContainer = styled.div`
  width: 95%;
  height: 40vh;
  border: 1px solid #c9c9c9;
  border-radius: 7px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
  margin: 1vh;
  display: flex;
  flex-direction: column;
`;
const RewardType = styled.div`
  font-size: 3.5vh;
  align-self: center;
  color: #eb8736;
  margin: 10px;
  font-weight: 500;
  border-bottom: solid 2.5px;
`;
const RewardCardContainer = styled.div`
  flex: 1 1 auto;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max(240px, 25%);
  grid-gap: 1ch;
  justify-items: stretch;
  padding: 1ch;
  overflow-x: auto;
`;

function ClaimRewardPage() {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState(null);
  const [beverages, setBeverages] = useState(null);
  const [otherrewards, setOtherrewards] = useState(null);
  const [userPoints, setUserPoints] = useState(null);

  const fetchVouchers = useCallback(async () => {
    axios
      .get(`${BACKEND_URL}/api/reward/getrewards?category=Vouchers`)
      .then((res) => {
        setVouchers(res.data);
      })
      .catch((err) => console.log(err, "error occured"));
  }, []);
  const fetchBeverages = useCallback(async () => {
    axios
      .get(`${BACKEND_URL}/api/reward/getrewards?category=Beverages`)
      .then((res) => {
        setBeverages(res.data);
      })
      .catch((err) => console.log(err, "error occured"));
  }, []);
  const fetchOthers = useCallback(async () => {
    axios
      .get(`${BACKEND_URL}/api/reward/getrewards?category=Others`)
      .then((res) => {
        setOtherrewards(res.data);
      })
      .catch((err) => console.log(err, "error occured"));
  }, []);
  useEffect(() => {
    fetchVouchers();
    fetchBeverages();
    fetchOthers();
  }, []);

  const getUserPoints = useCallback(async () => {
    if (user) {
      fetch(`${BACKEND_URL}/api/user/getPoints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })
        .then((req) => req.json())
        .then((data) => {
          if (data.status === "ok" && data.points !== undefined) {
            setUserPoints(data.points);
          } else {
            console.log("Error fetching user's points from backend");
          }
        });
    }
  }, [user]);
  useEffect(() => {
    getUserPoints();
  }, [getUserPoints]);

  function Rewards(props) {
    const { rewards, setRewards } = props;

    return (
      <>
        {rewards.map((r, index) =>
          !r.claimed ? (
            <RewardCard
              buttonText={"Claim it!"}
              itemDetails={r}
              key={index}
              setRewards={setRewards}
              userPoints={userPoints}
              setUserPoints={setUserPoints}
            />
          ) : null
        )}
      </>
    );
  }

  function LoadingRewards(props) {
    const numOfRewards = props.numOfRewards || 3;

    return (
      <>
        {[...Array(numOfRewards)].map((r, index) => {
          return <LoadingRewardCard key={index} />;
        })}
      </>
    );
  }

  return (
    <MainContainer>
      <NavigationBar></NavigationBar>
      <BelowNavBarContainer>
        <HeaderContainer>
          Helped a friend? Claim your Rewards below!
        </HeaderContainer>
        <Box width="100%">
          <Typography
            variant="h5"
            align="center"
            sx={{ color: theme.palette.success.main }}
          >
            You have: {userPoints || "..."} points
          </Typography>
        </Box>
        <RewardContainer>
          <RewardType>Vouchers</RewardType>
          {vouchers ? (
            vouchers.length ? (
              <RewardCardContainer>
                <Rewards rewards={vouchers} setRewards={setVouchers} />
              </RewardCardContainer>
            ) : (
              <Typography align="center" variant="subtitle1">
                No vouchers yet
              </Typography>
            )
          ) : (
            <RewardCardContainer>
              <LoadingRewards />
            </RewardCardContainer>
          )}
        </RewardContainer>
        <RewardContainer>
          <RewardType>Beverages</RewardType>
          {beverages ? (
            beverages.length ? (
              <RewardCardContainer>
                <Rewards rewards={beverages} setRewards={setBeverages} />
              </RewardCardContainer>
            ) : (
              <Typography align="center" variant="subtitle1">
                No beverage rewards yet
              </Typography>
            )
          ) : (
            <RewardCardContainer>
              <LoadingRewards />
            </RewardCardContainer>
          )}
        </RewardContainer>
        <RewardContainer>
          <RewardType>Others</RewardType>
          {otherrewards ? (
            otherrewards.length ? (
              <RewardCardContainer>
                <Rewards rewards={otherrewards} setRewards={setOtherrewards} />
              </RewardCardContainer>
            ) : (
              <Typography align="center" variant="subtitle1">
                No 'Other' rewards yet
              </Typography>
            )
          ) : (
            <RewardCardContainer>
              <LoadingRewards />
            </RewardCardContainer>
          )}
        </RewardContainer>
      </BelowNavBarContainer>
    </MainContainer>
  );
}

export default ClaimRewardPage;
