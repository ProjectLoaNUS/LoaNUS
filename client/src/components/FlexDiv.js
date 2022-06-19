import styled from "styled-components";

export const GrowDiv = styled.div`
  flex: 1 0 auto;
`;

export const ShrinkDiv = styled.div`
  flex: 0 1 auto;
`;

export const CentredDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CentredGrowDiv = styled(GrowDiv)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
