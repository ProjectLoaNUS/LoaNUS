import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { CentredDiv } from "../components/FlexDiv";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchResults from "../components/SearchResults/SearchResults";
import { Buffer } from 'buffer';
import { BACKEND_URL } from "../database/const";

const Container = styled.div`
  width: 100%;
  height: 100%;
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
    <Container>
      <NavigationBar></NavigationBar>
      <CentredDiv>Listings</CentredDiv>
      <SearchResults
        resultDatas={searchResultsText}
        setResultDatas={setSearchResultsText}
        resultImages={searchResultsImage} />
    </Container>
  );
}

export default SearchedListings;
