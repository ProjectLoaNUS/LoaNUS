import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import styled from "styled-components";
import Category from "./CategoryCard";
import axios from "axios";
import { BACKEND_URL } from "../../database/const";
import CategoryDetails from "./CategoryData";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 93vw;
  height: 35vh;
  border-color: 2px black solid;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: white;
`;

const ListingsGrid = styled.div`
  flex: 1 1 auto;
  display: grid;
  grid-auto-flow: column;
  align-items: stretch;
  padding-top: 0.5em;
  overflow-x: auto;
`;

function BrowseCategory() {
  return (
    <MainContainer>
      <Typography align="left" variant="h4" color="#eb8736">
        Browse by Category
      </Typography>
      <ListingsGrid>
        {CategoryDetails.map((data, index) => (
          <Category key={index} categorydetails={data}></Category>
        ))}
      </ListingsGrid>
    </MainContainer>
  );
}

export default BrowseCategory;
