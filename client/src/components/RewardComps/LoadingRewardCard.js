import { Card, Skeleton } from "@mui/material";
import { Box } from "@mui/system";
import styled from "styled-components";

const ListCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1em;
  padding: 1em;
`;
const PointsBox = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-right: calc(1ch - 1em);
  gap: 0.5ch;
`;

export default function LoadingRewardCard() {
    return (
        <ListCard>
            <Skeleton variant="text" sx={{flex: "0 0 auto"}} />
            <Skeleton variant="rectangle" sx={{flex: "1 1 auto"}} />
            <PointsBox>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="rectangle" width="1ch" height="100%" />
            </PointsBox>
        </ListCard>
    );
}