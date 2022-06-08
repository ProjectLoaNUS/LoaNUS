import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/DisplayCard";
import { Buffer } from 'buffer';
import { BACKEND_URL } from "../database/const";
import { Box } from "@mui/material";

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
  const [images, setImages] = useState([]);
  const [ urlImgs, setUrlImgs ] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getItems`)
      .then((res) => {
        setImages(res.data);
        binsToImgs(res.data);
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
      setUrlImgs(imgs);
    });
  }

  return (
    <MainContainer>
      <NavigationBar></NavigationBar>
      <div>Image upload</div>
      <ImagesBox>
        { images ? 
          (images.map((singleimage, index) => {
            return <ItemCard key={ index } title={singleimage.name} image={ urlImgs[index] } description={singleimage.desc} />
          })) : 
          "Loading..." 
        }
      </ImagesBox>
    </MainContainer>
  );
}

export default HomePage;
