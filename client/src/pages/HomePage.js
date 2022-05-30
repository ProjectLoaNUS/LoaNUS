import styled from "styled-components";
import NavigationBar from "../components/NavigationBar";
import { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/DisplayCard";

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
        console.log(res.data);
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
        
      </div>
    </MainContainer>
  );
}

export default HomePage;
