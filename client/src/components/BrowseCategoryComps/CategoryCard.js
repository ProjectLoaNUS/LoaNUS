import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../NewItem/ItemCategories";
import { CATEGORY_LISTINGS } from "../../pages/routes";
import { Avatar, Box, Typography } from "@mui/material";

const CategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 12vw;
  cursor: pointer;
  align-items: center;
  padding: 0 0.5em;
`;
const CategoryImage = styled(Avatar)`
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
`;
const CategoryText = styled(Typography)`
  font-weight: 650;
  font-size: larger;
  color: #2d3c4a;
  display: flex;
  justify-content: center;
  text-align: center;
  width: 80%;
  flex: 0 1 auto;
  word-break: break-word;
`;

function Category({ categorydetails }) {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const queryText = categorydetails?.number;
    if (queryText !== undefined) {
      navigate(CATEGORY_LISTINGS, { state: { queryText: queryText } });
    }
  };
  return (
    <CategoryCard onClick={handleSubmit}>
      <CategoryImage
        src={categorydetails.image}
        alt={CATEGORIES[categorydetails.number]}>
          C
      </CategoryImage>
      <CategoryText align="center">{CATEGORIES[categorydetails.number]}</CategoryText>
    </CategoryCard>
  );
}

export default Category;
