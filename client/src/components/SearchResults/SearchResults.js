import { Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { BACKEND_URL } from "../../database/const";
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
  const { queryText } = props;
  const [ searchResultsDetails, setSearchResultsDetails ] = useState([]);
  const [ searchResultsImages, setSearchResultsImages ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const url = `${BACKEND_URL}/api/items/search`;
    if (queryText) {
      // Images of search result items
      axios
        .get(url, {
          params: {
            name: queryText,
            isFullSearch: true,
            isImageOnly: true
          },
        })
        .then((res) => {
          setSearchResultsImages(res.data.results);
        })
        .catch((err) => console.log(err, "error occured"));
      // Text details(title, description, etc) of search result items
      axios
        .get(url, {
          params: {
            name: queryText,
            isFullSearch: true,
            isTextOnly: true
          },
        })
        .then((res) => {
          setSearchResultsDetails(res.data.results);
          setIsLoading(false);
        })
        .catch((err) => console.log(err, "error occured"));
    }
  }, [queryText]);

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
          isLoading={isLoading}
          CardContainer={ResultsGrid}
          itemImages={searchResultsImages}
          itemImagesType="base64"
          itemDatas={searchResultsDetails}
          setItemDatas={setSearchResultsDetails} />
    </PaddedGrid>
  );
};

export default SearchResults;
