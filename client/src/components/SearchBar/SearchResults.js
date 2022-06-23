import { List, ListItem, ListItemText } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 20vh;
  width: 70vh;
`;

const SearchResults = (props) => {
  const { searchResults } = props;
  return (
    <Container>
      <List>
        {searchResults.map(({ title }) => {
          return (
            <ListItem>
              <ListItemText primary={title} />
            </ListItem>
          )
        })}
      </List>
    </Container>
  );
};

export default SearchResults;
