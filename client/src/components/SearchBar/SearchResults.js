import { List, ListItem, ListItemText } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 20vh;
  width: 70vh;
`;

const SearchResults = (props) => {
  const { resultTexts, resultImages } = props;
  return (
    <Container>
      <List>
        {resultTexts && resultTexts.map((text) => {
          return (
            <ListItem>
              <ListItemText primary={text.title} />
            </ListItem>
          )
        })}
      </List>
    </Container>
  );
};

export default SearchResults;
