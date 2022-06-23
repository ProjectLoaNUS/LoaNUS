import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import ItemList from "../components/ItemList/ItemList";
import { CentredDiv } from "../components/FlexDiv";
import { useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchResults from "../components/SearchBar/SearchResults";
import { BACKEND_URL } from "../database/const";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

function SearchedListings() {
  const [searchResults, setSearchResults] = useState([]);
  const { state } = useLocation();
  useEffect(() => {
    const url = `${BACKEND_URL}/search`;
    const query = state ? (state.queryText || "") : "";
    if (query) {
      axios
        .get(url, {
          params: {
            name: query,
            isFullSearch: true
          },
        })
        .then((res) => {
          setSearchResults(res.data);
        })
        .catch((err) => console.log(err, "error occured"));
    }
  }, []);

  return (
    <Container>
      <NavigationBar></NavigationBar>
      <CentredDiv>Listings</CentredDiv>
      <SearchResults searchResults={searchResults}></SearchResults>
    </Container>
  );
}

export default SearchedListings;
