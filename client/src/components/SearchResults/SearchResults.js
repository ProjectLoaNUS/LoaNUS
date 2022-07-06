import { Grid } from "@mui/material";
import styled from "styled-components";
import ItemList from "../ItemList/ItemList";

const PaddedGrid = styled(Grid)`
  padding: 1ch 1rem;
  min-height: 33%;
  overflow-y: auto;
`;
const ItemGrid = styled(Grid)`
  .MuiCard-root {
    height: 100%;
    width: 100%;
  }
`;

const SearchResults = (props) => {
  const { resultDatas, setResultDatas, resultImages } = props;

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
          itemImages={resultImages}
          itemDatas={resultDatas}
          setItemDatas={setResultDatas} />
    </PaddedGrid>
  );
};

export default SearchResults;
