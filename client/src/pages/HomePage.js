import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { useEffect } from "react";
import RecentListings from "../components/ItemList/RecentListings";
import { useAuth } from "../database/auth";
import RecommendationListings from "../components/RecommendationComps/RecommendationListing";
import AboutLoanus from "../components/AboutLoanus";
import BrowseCategory from "../components/BrowseCategoryComps/BrowseCategory";

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
  const { user, setUser } = useAuth();

  useEffect(() => {
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

  return (
    <MainContainer>
      <NavigationBar></NavigationBar>
      <BodyContainer>
        <AboutLoanus />
        <BrowseCategory></BrowseCategory>
        <RecommendationListings />
        <RecentListings />
      </BodyContainer>
    </MainContainer>
  );
}

export default HomePage;
