import styled from "styled-components";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { useAuth } from "../../../database/auth";
import { Container } from "@mui/material";
import { BACKEND_URL } from "../../../database/const";
import { deleteRequestAction } from "../../ItemDetails/detailsDialogActions";
import YourRequests from "./YourRequests";
import AllMatches from "./PotentialMatches/AllMatches";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../../utils/jwt-config";

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
    overflow-y: hidden;

    & .MuiBox-root {
      display: flex;
      flex-direction: column;
      align-items: stretch;
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
    if (user?.id && requests === null) {
      const token = jwt.sign(
        {id: user.id},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
      );
      fetch(`${BACKEND_URL}/api/items/getRequestsOfUser`, {
        method: "GET",
        headers: {
          "x-auth-token": token
        }
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
        <Tab label="Your Requests" />
        <Tab label="Potential Matches" />
      </Tabs>
      <TabPanel value={selectedTab} index={0} sx={{flex: selectedTab === 0 ? "1 1 auto" : "0 0 0"}}>
        <YourRequests
          isLoading={isLoading}
          requests={requests}
          setRequests={setRequests}
          deleteRequestAction={deleteRequestAction} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1} sx={{flex: selectedTab === 1 ? "1 1 auto" : "0 0 0"}}>
        <AllMatches requests={requests} />
      </TabPanel>
    </MainContainer>
  );
}

export default Requests;
