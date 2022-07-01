import styled from "styled-components";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ItemList from "../ItemList/ItemList";
import { useState, useEffect } from "react";
import { useAuth } from "../../database/auth";
import { Grid } from "@mui/material";
import { BACKEND_URL } from "../../database/const";

const MainContainer = styled.div`
  height: auto;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const PaddedGrid = styled(Grid)`
  height: 100%;
  width: 100%;
  padding: 1ch 1rem;
  margin-top: 0;
  overflow-y: auto;
`;
const ItemGrid = styled(Grid)`
  .MuiCard-root {
    height: 100%;
    width: 100%;
  }
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function Requests() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { user } = useAuth();
  const [ requests, setRequests ] = useState([]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/items/getRequestsOfUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id
      }),
    })
    .then(req => req.json())
    .then(data => {
      if (data.status === "ok") {
        setRequests(data.requests);
      }
    });
  }, [user]);

  function RequestsGrid(props) {
    const { children } = props;

    return (
      <ItemGrid item alignItems="stretch" justifyContent="center" xl={4} xs={4}>
        {children}
      </ItemGrid>
    );
  }

  return (
    <MainContainer>
      <Tabs variant="scrollable" value={selectedTab} onChange={handleChange}>
        <Tab label="Your Requests"></Tab>
        <Tab label="Requests for approval"></Tab>
      </Tabs>
      <TabPanel value={selectedTab} index={0}>
        <PaddedGrid container spacing={1}>
          <ItemList
            CardContainer={RequestsGrid}
            texts={requests}
            setTexts={setRequests} />
        </PaddedGrid>
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        No Requests currently
      </TabPanel>
    </MainContainer>
  );
}

export default Requests;
