import styled from "styled-components";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Container, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import SearchUserField from "./UserSearch";
import FollowerDisplay from "./FollowersDisplay";
import FollowingDisplay from "./FollowingDisplay";

const MainContainer = styled.div`
  min-height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  & .MuiContainer-root{
    overflow-y: hidden;
    & .MuiBox-root {
      width: 100%;
      height: 100%;
      padding: 0;
    }
  }
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Container
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Container>
  );
}

function Follow() {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <MainContainer>
      <Tabs variant="scrollable" value={selectedTab} onChange={handleChange}>
        <Tab label="Search users"></Tab>
        <Tab label="Followers"></Tab>
        <Tab label="Following"></Tab>
        {/*<Tab label="Requests for approval"></Tab>*/}
      </Tabs>
      <TabPanel value={selectedTab} index={0} sx={{flex: selectedTab === 0 ? "1 1 auto" : "0 0 0"}}>
        <SearchUserField></SearchUserField>
      </TabPanel>
      <TabPanel value={selectedTab} index={1} sx={{flex: selectedTab === 1 ? "1 1 auto" : "0 0 0"}}>
        <FollowerDisplay></FollowerDisplay>
      </TabPanel>
      <TabPanel value={selectedTab} index={2} sx={{flex: selectedTab === 2 ? "1 1 auto" : "0 0 0"}}>
        <FollowingDisplay></FollowingDisplay>
      </TabPanel>
    </MainContainer>
  );
}

export default Follow;
