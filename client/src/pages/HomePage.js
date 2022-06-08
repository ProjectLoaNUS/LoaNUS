import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/DisplayCard";
import { Buffer } from 'buffer';
import { BACKEND_URL } from "../database/const";
import { Box } from "@mui/material";
import { CentredDiv } from "../components/FlexDiv";
import Loading from "../assets/loading.svg";

const MainContainer = styled.div`
  background-color: #fafdf3;
`;

const ImagesBox = styled(Box)`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
`;

function HomePage() {
  const [ texts, setTexts ] = useState([]);
  const [ imgUrls, setImgUrls ] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getItemImages`)
      .then((res) => {
        binsToImgs(res.data);
      })
      .catch((err) => console.log(err, "error occured"));
    axios
      .get(`${BACKEND_URL}/getItemTexts`)
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
      <ImagesBox>
        { texts ? 
          (texts.map((text, index) => {
            return <ItemCard key={ index } title={text.name} image={ imgUrls[index] || Loading } description={text.desc} />
          })) : 
          "Loading..." 
        }
      </ImagesBox>
    </MainContainer>
  );
}

export default HomePage;
