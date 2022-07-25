import { Box, Stack, Typography } from "@mui/material";
import styled from "styled-components";
import { theme } from "../../../utils/Theme";
import RewardImageCard from "./RewardImageCard";

const ImageStack = styled(Stack)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  align-self: stretch;
  height: 30vh;
  column-gap: 1ch;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1ch;
  border: ${(props) =>
    props.$iserror
      ? `2px solid ${theme.palette.error.main}`
      : `1px solid ${theme.palette.primary.main}`};
  border-radius: 4px;
`;

export default function RewardImage(props) {
  const { image, setImage, imageRef, isError, setIsError } = props;

  return (
    <Box alignSelf="stretch" marginTop="-0.5em">
      <Typography align="left" variant="subtitle2" sx={{ paddingLeft: "1em" }}>
        Image
      </Typography>
      <ImageStack direction="row" $iserror={isError}>
        <RewardImageCard
          image={image}
          setImage={setImage}
          imageRef={imageRef}
          setIsError={setIsError}
        />
      </ImageStack>
    </Box>
  );
}
