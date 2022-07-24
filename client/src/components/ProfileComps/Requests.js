import styled from "styled-components";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ItemList from "../ItemList/ItemList";
import { useState, useEffect } from "react";
import { useAuth } from "../../database/auth";
import { Container } from "@mui/material";
import { BACKEND_URL } from "../../database/const";
import { deleteRequestAction } from "../ItemDetails/detailsDialogActions";

const MainContainer = styled.div`
  min-height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  & .MuiTabs-root {
    flex: 0 0 auto;
  }
  & .MuiContainer-root {
    padding: 0;

    & .MuiBox-root {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      height: 100%;
      padding: 0;
    }
  }
`;
const RequestsGrid = styled.div`
  --grid-layout-gap: 1ch;
  --grid-column-count: 4;
  --grid-item--min-width: 210px;

  --gap-count: calc(var(--grid-column-count) - 1);
  --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
  --grid-item--max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));
  --grid-item-width: max(var(--grid-item--min-width), var(--grid-item--max-width));

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-item-width), 1fr));
  grid-auto-rows: calc(var(--grid-item-width) * 2 / 3);
  grid-gap: var(--grid-layout-gap);
  align-items: stretch;
  justify-items: stretch;
  padding: 1ch;
  height: 100%;
  overflow-y: auto;
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
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </Container>
  );
}

function Requests() {
  const [ selectedTab, setSelectedTab ] = useState(0);
  const { user } = useAuth();
  const [ requests, setRequests ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(true);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (user && requests === null) {
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
          setIsLoading(false);
        }
      });
    }
  }, [user]);

  return (
    <MainContainer>
      <Tabs variant="scrollable" value={selectedTab} onChange={handleChange}>
        <Tab label="Your Requests"></Tab>
        {/*<Tab label="Requests for approval"></Tab>*/}
      </Tabs>
      <TabPanel value={selectedTab} index={0} sx={{flex: selectedTab === 0 ? "1 1 auto" : "0 0 0"}}>
        <ItemList
          ListContainer={RequestsGrid}
          isLoading={isLoading}
          buttonText="Delete request"
          noItemsText="No item requests yet. Create one?"
          itemDatas={requests}
          setItemDatas={setRequests}
          isOwnerOnClickAction={deleteRequestAction}
          isOwnerButtonText="Delete request" />
      </TabPanel>
      {/*<TabPanel value={selectedTab} index={1} sx={{flex: selectedTab === 1 ? "1 1 auto" : "0 0 0"}}>
        No Requests currently
      </TabPanel>*/}
    </MainContainer>
  );
}

export default Requests;
