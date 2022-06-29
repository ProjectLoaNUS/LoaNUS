import styled from "styled-components";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";

const MainContainer = styled.div`
  height: auto;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <MainContainer>
      <Tabs variant="scrollable" value={selectedTab} onChange={handleChange}>
        <Tab label="Your Requests"></Tab>
        <Tab label="Requests for approval"></Tab>
      </Tabs>
      <TabPanel value={selectedTab} index={0}>
        No Requests currently
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        No Requests currently
      </TabPanel>
    </MainContainer>
  );
}

export default Requests;
