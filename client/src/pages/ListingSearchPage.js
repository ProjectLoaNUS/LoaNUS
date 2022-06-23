import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import ItemList from "../components/ItemList/ItemList";
import { CentredDiv } from "../components/FlexDiv";
import { useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchResults from "../components/SearchBar/SearchResults";
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
    const url = `${BACKEND_URL}/search`;
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
          binsToImgUrls(res.data);
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
          setSearchResultsText(res.data);
        })
        .catch((err) => console.log(err, "error occured"));
    }
  }, []);

  async function binsToImgUrls(bins) {
    let imgs = [];
    bins.forEach((bin, index) => {
      const datas = bin.images.data;
      let urls = [];
      datas.forEach((data, i) => {
        const binary = Buffer.from(data.data);
        const blob = new Blob([binary.buffer], {type: bin.images.contentType[i]});
        const url = URL.createObjectURL(blob);
        urls[i] = url;
      });
      imgs[index] = urls;
    });
    setSearchResultsImage(imgs);
  }

  return (
    <Container>
      <NavigationBar></NavigationBar>
      <CentredDiv>Listings</CentredDiv>
      <SearchResults resultTexts={searchResultsText} resultImages={searchResultsImage}></SearchResults>
    </Container>
  );
}

export default SearchedListings;
