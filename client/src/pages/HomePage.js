import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/DisplayCard";
import { Buffer } from 'buffer';

const MainContainer = styled.div`
  background-color: #fafdf3;
`;

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/getItems")
      .then((res) => {
        setImages(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err, "error occured"));
  }, []);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <MainContainer>
      <NavigationBar></NavigationBar>
      <div>Image upload</div>
      <div>
        {images.map((singleimage) => {
          const binary = Buffer.from(singleimage.image.data.data);
          const blob = new Blob([binary.buffer], {type: 'application/octet-binary'});
          const url = URL.createObjectURL(blob);
          return <img src={url} alt="" />;
        })}
      </div>
    </MainContainer>
  );
}

export default HomePage;
