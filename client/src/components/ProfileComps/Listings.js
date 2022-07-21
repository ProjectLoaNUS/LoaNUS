import { Box, Container, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import AllListings from "./AllListings";
import ListingsToApprove from "./ListingsToApprove";

const TabsView = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  justify-content: flex-start;
  align-items: center;

  & .MuiContainer-root{
    overflow-y: hidden;
    & .MuiBox-root {
      width: 100%;
      height: 100%;
      padding: 0;
    }
  }
`;

export default function Listings() {
    const [selectedTab, setSelectedTab] = useState(0);
    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

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

    return (
        <TabsView>
            <Tabs variant="scrollable" value={selectedTab} onChange={handleChange}>
                <Tab label="All" />
                <Tab label="Pending Approval" />
            </Tabs>
            <TabPanel value={selectedTab} index={0} sx={{flex: selectedTab === 0 ? "1 1 auto" : "0 0 0"}}>
                <AllListings />
            </TabPanel>
            <TabPanel value={selectedTab} index={1} sx={{flex: selectedTab === 1 ? "1 1 auto" : "0 0 0"}}>
                <ListingsToApprove />
            </TabPanel>
        </TabsView>
    );
}