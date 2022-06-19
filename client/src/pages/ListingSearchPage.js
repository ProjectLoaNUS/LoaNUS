import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import ItemList from "../components/ItemList/ItemList";
import { CentredDiv } from "../components/FlexDiv";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchResults from "../components/SearchBar/SearchResults";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

function SearchedListings() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("name");
  useEffect(() => {
    const url = "http://localhost:3001/search";
    axios
      .get(url, {
        params: {
          name: searchTerm,
        },
      })
      .then((res) => {
        setSearchResults(res.data);
      })
      .catch((err) => console.log(err, "error occured"));
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
