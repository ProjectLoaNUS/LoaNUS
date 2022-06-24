import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Buffer } from 'buffer';
import { BACKEND_URL } from "../database/const";
import ListingList from "../components/ItemList/ListingList";
import { useAuth } from "../database/auth";

const MainContainer = styled.div`
  background-color: #fafdf3;
  min-height: 100vh;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  padding: 1rem 0;
`;

function HomePage() {
  const [ listingTexts, setListingTexts ] = useState([]);
  const [ listingImgs, setListingImgs ] = useState([]);
  const { user, setUser } = useAuth();

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
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
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
    setListingImgs(imgs);
  }

  return (
    <MainContainer>
      <NavigationBar></NavigationBar>
      <BodyContainer>
        <ListingList imageUrls={listingImgs} texts={listingTexts} />
      </BodyContainer>
    </MainContainer>
  );
}

export default HomePage;
