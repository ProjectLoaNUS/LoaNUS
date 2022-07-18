import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../NewItem/ItemCategories";
import { CATEGORY_LISTINGS } from "../../pages/routes";

const CategoryCard = styled.div`
  height: 20vh;
  width: 12vw;
  cursor: pointer;
`;
const ImageContainer = styled.img`
  vertical-align: middle;
  width: 80%;
  height: 90%;
  overflow: hidden;
  border-radius: 50%;
`;

const CategoryText = styled.div`
  font-weight: 650;
  font-size: larger;
  color: #2d3c4a;
  display: flex;
  justify-content: center;
  text-align: center;
  width: 80%;
`;

function Category({ categorydetails }) {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const queryText = categorydetails?.number;
    if (queryText) {
      navigate(CATEGORY_LISTINGS, { state: { queryText: queryText } });
    }
  };
  return (
    <CategoryCard onClick={handleSubmit}>
      <ImageContainer src={categorydetails.image} alt="Coffee"></ImageContainer>
      <CategoryText>{CATEGORIES[categorydetails.number]}</CategoryText>
    </CategoryCard>
  );
}

export default Category;
