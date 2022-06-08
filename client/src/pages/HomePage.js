import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/DisplayCard";
import { Buffer } from 'buffer';
import { BACKEND_URL } from "../database/const";

const MainContainer = styled.div`
  background-color: #fafdf3;
`;

function HomePage() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getItems`)
      .then((res) => {
        setImages(res.data);
      })
      .catch((err) => console.log(err, "error occured"));
  }, []);

  return (
    <MainContainer>
      <NavigationBar></NavigationBar>
      <div>Image upload</div>
      <div>
        { images ? 
          (images.map((singleimage) => {
            const binary = Buffer.from(singleimage.image.data.data);
            const blob = new Blob([binary.buffer], {type: 'application/octet-binary'});
            const url = URL.createObjectURL(blob);
            return <ItemCard title={singleimage.name} image={url} description={singleimage.desc} />
          })) : 
          "Loading..." 
        }
      </div>
    </MainContainer>
  );
}

export default HomePage;
