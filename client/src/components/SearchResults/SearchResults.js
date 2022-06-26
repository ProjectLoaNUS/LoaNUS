import { Grid } from "@mui/material";
import React from "react";
import styled from "styled-components";
import ItemList from "../ItemList/ItemList";

const Container = styled.div`
  height: 20vh;
  width: 70vh;
`;
const PaddedGrid = styled(Grid)`
  padding: 0 1rem;
`;
const ItemGrid = styled(Grid)`
  .MuiCard-root {
    height: 100%;
    width: 100%;
  }
`;

const SearchResults = (props) => {
  const { resultTexts, setResultTexts, resultImages, setResultImages } = props;

  function ResultsGrid(props) {
    const { children, key } = props;

    return (
      <ItemGrid item key={key} alignItems="stretch" justifyContent="center" xs={4}>
        {children}
      </ItemGrid>
    );
  }

  return (
    <PaddedGrid container spacing={1}>
        <ItemList
          CardContainer={ResultsGrid}
          texts={resultTexts}
          setTexts={setResultTexts}
          imageUrls={resultImages}
          setimageUrls={setResultImages} />
    </PaddedGrid>
  );
};

export default SearchResults;
