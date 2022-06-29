import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Buffer } from 'buffer';
import { BACKEND_URL } from "../database/const";
import RecentListings from "../components/ItemList/RecentListings";
import { useAuth } from "../database/auth";
import AboutLoanus from "../components/AboutLoanus";

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
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [user, setUser]);

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
        <RecentListings imageUrls={listingImgs} setImageUrls={setListingImgs} texts={listingTexts} setTexts={setListingTexts} />
        <AboutLoanus />
      </BodyContainer>
    </MainContainer>
  );
}

export default HomePage;
