import styled from "styled-components";
import { useAuth } from "../../database/auth";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../database/const";
import axios from "axios";
import RewardCard from "../RewardComps/RewardCard";
import LoadingRewardCards from "../RewardComps/LoadingRewardCards";
import { Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CLAIM_REWARD } from "../../pages/routes";
import ButtonComponent from "../../utils/Button";
import { useCallback } from "react";

const RewardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  padding-top: 0.5em;
`;
const ItemsGrid = styled.div`
  --grid-layout-gap: 1ch;
  --grid-column-count: 4;
  --grid-item--min-width: 240px;

  --gap-count: calc(var(--grid-column-count) - 1);
  --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
  --grid-item--max-width: calc(
    (100% - var(--total-gap-width)) / var(--grid-column-count)
  );
  --grid-item-width: max(
    var(--grid-item--min-width),
    var(--grid-item--max-width)
  );

  flex: 1 1 auto;
  align-self: stretch;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-item-width), 1fr));
  grid-auto-rows: calc(var(--grid-item-width) * 6 / 5);
  grid-gap: var(--grid-layout-gap);
  align-items: stretch;
  justify-items: stretch;
  padding: 1ch;
  overflow-y: auto;
`;
export default function Rewards() {
  const [rewards, setRewards] = useState(null);
  const [userPoints, setUserPoints] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchRewards = useCallback(async () => {
    if (user) {
      const data = {
        userId: user.id,
      };
      axios
        .post(`${BACKEND_URL}/api/reward/getRewardsOfUser`, data)
        .then((res) => {
          if (res.data.status === "ok") {
            setRewards(res.data.rewards);
          } else {
            console.log("Error occurred while fetching rewards claimed");
          }
        })
        .catch((err) => console.log(err, "error occured"));
    }
  }, [user]);
  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const fetchPoints = useCallback(async () => {
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
  }, [user]);
  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  const onClickClaim = () => {
    navigate(CLAIM_REWARD);
  };

  if (rewards) {
    return rewards.length ? (
      <RewardsContainer>
        <ButtonComponent
          size="small"
          text="Claim more rewards"
          onClick={onClickClaim}
          state="primary"
        />
        <ItemsGrid>
          {rewards.map((r, index) => (
            <RewardCard
              buttonText={"Use it!"}
              itemDetails={r}
              key={index}
              setRewards={setRewards}
              shouldRedeem={true}
              userPoints={userPoints}
              setUserPoints={setUserPoints}
            />
          ))}
        </ItemsGrid>
      </RewardsContainer>
    ) : (
      <Typography variant="subtitle1" align="center" sx={{ paddingTop: "1em" }}>
        No rewards claimed yet. Check out the '
        <Link onClick={onClickClaim}>Claim rewards</Link>' page!
      </Typography>
    );
  }
  return <LoadingRewardCards />;
}
