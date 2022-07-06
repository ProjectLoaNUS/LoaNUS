import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchResults from "../components/SearchResults/SearchResults";
import { BACKEND_URL } from "../database/const";
import { Typography } from "@mui/material";

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  height: 90%;
  gap: 1ch;
`;

const SearchTitle = styled(Typography)`
  flex: 0 0 auto;
  padding: 0 1rem;
`;

function SearchedListings() {
  const [searchResultsText, setSearchResultsText] = useState([]);
  const [searchResultsImage, setSearchResultsImage] = useState([]);
  const { state } = useLocation();

  useEffect(() => {
    const url = `${BACKEND_URL}/api/items/search`;
    const query = state ? (state.queryText || "") : "";
    if (query) {
      // Images of search result items
      axios
        .get(url, {
          params: {
            name: query,
            isFullSearch: true,
            isImageOnly: true
          },
        })
        .then((res) => {
          setSearchResultsImage(res.data.results);
        })
        .catch((err) => console.log(err, "error occured"));
      // Text details(title, description, etc) of search result items
      axios
        .get(url, {
          params: {
            name: query,
            isFullSearch: true,
            isTextOnly: true
          },
        })
        .then((res) => {
          setSearchResultsText(res.data.results);
        })
        .catch((err) => console.log(err, "error occured"));
    }
  }, [state]);

  return (
    <PageContainer>
      <NavigationBar></NavigationBar>
      <SearchContainer>
        <SearchTitle variant="h3">
          Search results for "{state ? (state.queryText || "") : ""}"
        </SearchTitle>
        <SearchResults
          resultDatas={searchResultsText}
          setResultDatas={setSearchResultsText}
          resultImages={searchResultsImage} />
      </SearchContainer>
    </PageContainer>
  );
}

export default SearchedListings;
