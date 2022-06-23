import { Grid, List, ListItem, ListItemText } from "@mui/material";
import React from "react";
import styled from "styled-components";
import ListingCard from "../ItemList/ListingCard";
import Loading from "../../assets/loading.svg";
import NoImage from "../../assets/no-image.png";
import { CATEGORIES } from "../NewItem/ItemCategories";

const Container = styled.div`
  height: 20vh;
  width: 70vh;
`;
const ResultCard = styled(ListingCard)`
  height: 100%;
  width: 100%;
`;
const PaddedGrid = styled(Grid)`
  padding: 0 1rem;
`;

const SearchResults = (props) => {
  const { resultTexts, resultImages } = props;
  console.log(resultImages);

  return (
    <PaddedGrid container>
        {resultTexts && resultTexts.map((text, index) => {
          const date = new Date(text.date).toLocaleDateString({}, 
              {year: 'numeric', month: 'short', day: 'numeric'});
          const deadline = new Date(text.deadline).toLocaleDateString({}, 
              {year: 'numeric', month: 'short', day: 'numeric'});
          const category = CATEGORIES[text.category];

          return (
            <Grid item direction="column" alignItems="stretch" justifyContent="center" xs={4}>
              {text.title}
            </Grid>
          )
        })}
    </PaddedGrid>
  );
};

export default SearchResults;
