import { Grid } from "@mui/material";
import React from "react";
import styled from "styled-components";
import ItemList from "../ItemList/ItemList";

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
    const { children } = props;

    return (
      <ItemGrid item alignItems="stretch" justifyContent="center" xs={4}>
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
          setImageUrls={setResultImages} />
    </PaddedGrid>
  );
};

export default SearchResults;
