import { Box, Container, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../database/auth";
import { BACKEND_URL } from "../../database/const";
import AllListings from "./AllListings";
import LikedListings from "./LikedListings";
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
    const { user } = useAuth();
    const [listingTexts, setListingTexts] = useState(null);
    const [listingImgs, setListingImgs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
  
    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
      if (user) {
        if (listingImgs === null) {
          fetch(`${BACKEND_URL}/api/items/getListingsImgsOfUser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user?.id,
            }),
          })
          .then((req) => req.json())
          .then((data) => {
            if (data.status === "ok") {
              setListingImgs(data.listingsImgs);
            }
          });
        }
        if (listingTexts === null) {
          fetch(`${BACKEND_URL}/api/items/getListingsTextsOfUser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user?.id,
            }),
          })
          .then((req) => req.json())
          .then((data) => {
            if (data.status === "ok") {
              setListingTexts(data.listingsTexts);
              setIsLoading(false);
            }
          });
        }
      }
    }, [user]);

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
                <Tab label="Liked" />
                <Tab label="Pending Approval" />
            </Tabs>
            <TabPanel value={selectedTab} index={0} sx={{flex: selectedTab === 0 ? "1 1 auto" : "0 0 0"}}>
                <AllListings
                  listingTexts={listingTexts}
                  setListingTexts={setListingTexts}
                  listingImgs={listingImgs}
                  isLoading={isLoading} />
            </TabPanel>
            <TabPanel value={selectedTab} index={1} sx={{flex: selectedTab === 1 ? "1 1 auto" : "0 0 0"}}>
                <LikedListings />
            </TabPanel>
            <TabPanel value={selectedTab} index={2} sx={{flex: selectedTab === 2 ? "1 1 auto" : "0 0 0"}}>
                <ListingsToApprove
                  listingTexts={listingTexts}
                  setListingTexts={setListingTexts}
                  listingImgs={listingImgs}
                  isLoading={isLoading} />
            </TabPanel>
        </TabsView>
    );
}