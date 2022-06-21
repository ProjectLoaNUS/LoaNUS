import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Buffer } from 'buffer';
import { BACKEND_URL } from "../database/const";
import ListingList from "../components/ItemList/ListingList";

const MainContainer = styled.div`
  background-color: #fafdf3;
`;

function HomePage() {
  const [ listingTexts, setListingTexts ] = useState([]);
  const [ listingImgs, setListingImgs ] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/items/getListingsImgs`)
      .then((res) => {
        binsToImgUrls(res.data.images);
      })
      .catch((err) => console.log(err, "error occured"));
    axios
      .get(`${BACKEND_URL}/api/items/getListingsTexts`)
      .then((res) => {
        setListingTexts(res.data.listings);
      })
      .catch((err) => console.log(err, "error occured"));
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
    setListingImgs(imgs);
  }

  return (
    <MainContainer>
      <NavigationBar></NavigationBar>
      <ListingList imageUrls={listingImgs} texts={listingTexts} />
    </MainContainer>
  );
}

export default HomePage;
