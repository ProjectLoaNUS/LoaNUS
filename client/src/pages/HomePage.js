import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Buffer } from 'buffer';
import { BACKEND_URL } from "../database/const";
import { CentredDiv } from "../components/FlexDiv";
import ItemList from "../components/ItemList/ItemList";

const MainContainer = styled.div`
  background-color: #fafdf3;
`;

function HomePage() {
  const [ texts, setTexts ] = useState([]);
  const [ imgUrls, setImgUrls ] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/getItemImages`)
      .then((res) => {
        binsToImgs(res.data);
      })
      .catch((err) => console.log(err, "error occured"));
    axios
      .get(`${BACKEND_URL}/api/getItemTexts`)
      .then((res) => {
        setTexts(res.data);
      })
      .catch((err) => console.log(err, "error occured"));
  }, []);

  async function binsToImgs(bins) {
    var imgs = [];
    bins.forEach((bin, index) => {
      const binary = Buffer.from(bin.image.data.data);
      const blob = new Blob([binary.buffer], {type: 'application/octet-binary'});
      const url = URL.createObjectURL(blob);
      imgs[index] = url;
      setImgUrls(imgs);
    });
  }

  return (
    <MainContainer>
      <NavigationBar></NavigationBar>
      <CentredDiv>Image upload</CentredDiv>
      <ItemList texts={texts} setTexts={setTexts} imgUrls={imgUrls} setImgUrls={setImgUrls} />
    </MainContainer>
  );
}

export default HomePage;
