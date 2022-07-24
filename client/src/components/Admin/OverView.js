import styled from "styled-components";
import React from "react";
import {
  Card,
  Slide,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const CreateCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: max(80%, 300px);
  align-self: center;
  padding: 0.5em;
  gap: 0.5em;
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
`;
const Dos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2vw;
  color: #2d3c4a;
`;

const Donts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2vw;
  color: #2d3c4a;
`;

function OverView() {
  return (
    <CreateCard>
      <Typography align="center" variant="h4" fontWeight="600" color="#eb8736">
        You Have been appointed an administrator of LoaNUS
      </Typography>
      <Container>
        <Dos>
          Dos
          <List>
            <ListItem>
              <ListItemText primary="- Upkeep the state of application" />
            </ListItem>
            <ListItem>
              <ListItemText primary="- Practice integrity" />
            </ListItem>
            <ListItem>
              <ListItemText primary="- Remove inappropriate objects" />
            </ListItem>
            <ListItem>
              <ListItemText primary="- Perform frequent bug checks" />
            </ListItem>
            <ListItem>
              <ListItemText primary="- Update issues user faced" />
            </ListItem>
            <ListItem>
              <ListItemText primary="- Answer user enquiries" />
            </ListItem>
          </List>
        </Dos>
        <Donts>
          Donts
          <List>
            <ListItem>
              <ListItemText primary="- Delete requests/listings unnecessarily " />
            </ListItem>
            <ListItem>
              <ListItemText primary="- Initate random conversation with user" />
            </ListItem>
            <ListItem>
              <ListItemText primary="- Amend user data" />
            </ListItem>
            <ListItem>
              <ListItemText primary="- Leak user personal details" />
            </ListItem>
            <ListItem>
              <ListItemText primary="- Change state of application without permission" />
            </ListItem>
            <ListItem>
              <ListItemText primary="- Add inappropriate rewards" />
            </ListItem>
          </List>
        </Donts>
      </Container>
    </CreateCard>
  );
}

export default OverView;
