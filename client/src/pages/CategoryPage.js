import styled from "styled-components";
import NavigationBar from "../components/NavBar/NavigationBar";
import { useLocation } from "react-router-dom";
import CategoryResults from "../components/BrowseCategoryComps/CategorySearch";
import { Typography } from "@mui/material";
import { CATEGORIES } from "../components/NewItem/ItemCategories";

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  height: 90%;
  gap: 1ch;
`;

const SearchTitle = styled(Typography)`
  flex: 0 0 auto;
  padding: 0 1rem;
`;

function CategoryListings() {
  const { state } = useLocation();

  return (
    <PageContainer>
      <NavigationBar></NavigationBar>
      <SearchContainer>
        <SearchTitle variant="h3">
          {state ? CATEGORIES[state.queryText] || "" : ""}
        </SearchTitle>
        <CategoryResults queryText={state && state.queryText} />
      </SearchContainer>
    </PageContainer>
  );
}

export default CategoryListings;
