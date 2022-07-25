import { Stack } from "@mui/material";
import styled from "styled-components";
import { theme } from "../../utils/Theme";

const ImageStack = styled(Stack)`
  flex: 0 0 auto;
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
  border: 1px solid ${theme.palette.primary.main};
  border-radius: 4px;
`;
const ImageDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 1 0;
  min-height: 0;
  width: max(40%, 300px);
  img {
    min-height: 0;
    object-fit: contain;
  }
`;

export default function ImageList(props) {
  const { imageUrls } = props;

  return (
    <ImageStack direction="row">
      {imageUrls.map((imageUrl, index) => {
        return (
          <ImageDiv key={index}>
            <img src={imageUrl} alt="Item image" />
          </ImageDiv>
        );
      })}
    </ImageStack>
  );
}
