import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/DisplayCard";

const MainContainer = styled.div`
  background-color: #fafdf3;
`;

function HomePage() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/item-upload")
      .then((res) => setImages(res.data))
      .catch((err) => console.log(err, "error occured"));
  }, []);
  return (
    <MainContainer>
      <NavigationBar></NavigationBar>
      <div>Image upload</div>
      <div>
        {images.map((singleimage) => {
          const base64string = btoa(
            String.fromCharCode(...new Uint8Array(singleimage.image.data.data))
          );
          return <img src={`data:image/png;base64,${base64string}`} alt="" />;
        })}
      </div>
    </MainContainer>
  );
}

export default HomePage;
