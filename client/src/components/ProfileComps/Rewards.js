import styled from "styled-components";
import { useAuth } from "../../database/auth";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../database/const";
import axios from "axios";
import RewardCard from "../RewardComps/RewardCard";

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

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-item-width), 1fr));
  grid-auto-rows: calc(var(--grid-item-width) * 6 / 5);
  grid-gap: var(--grid-layout-gap);
  align-items: stretch;
  justify-items: stretch;
  padding: 1ch;
  height: 100%;
  overflow-y: auto;
`;
export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const data = {
        userId: user.id,
      };
      axios
        .post(`${BACKEND_URL}/api/reward/getRewardsOfUser`, data)
        .then((res) => {
          if (res.data.status === 'ok') {
            setRewards(res.data.rewards);
          } else {
            console.log("Error occurred while fetching rewards claimed");
          }
        })
        .catch((err) => console.log(err, "error occured"));
    }
  }, [user]);

  return (
    <ItemsGrid>
      {rewards.map((r, index) => (
        <RewardCard
          buttonText={"Use it!"}
          itemDetails={r}
          key={index}
          setReward={setRewards}
        />
      ))}
    </ItemsGrid>
  );
}
