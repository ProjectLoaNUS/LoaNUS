import styled from "styled-components";
import LoadingRewardCard from "./LoadingRewardCard";

const RewardsGrid = styled.div`
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

export default function LoadingRewardCards(props) {
    const numOfRewards = props.numOfRewards || 3;

    return (
        <RewardsGrid>
            {
                [...Array(numOfRewards)].map((reward, index) => {
                    return <LoadingRewardCard key={index} />
                })
            }
        </RewardsGrid>
    );
}