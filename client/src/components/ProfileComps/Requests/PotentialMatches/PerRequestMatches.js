import { Box, Collapse, Divider, Grow, ListItemButton, Typography } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../../../../database/const";
import styled from "styled-components";
import ItemList from "../../../ItemList/ItemList";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MatchesGrid = styled.div`
  flex: 1 1 auto;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max(240px, 25%);
  grid-gap: 1ch;
  justify-items: stretch;
  padding: 1ch;
  overflow-x: auto;
`;
const Match = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: ${(props) => (props.show ? `280px` : `auto`)};
  height: ${(props) => (props.show ? `max(280px, 40%)` : `auto`)};
  max-height: ${(props) => (props.show ? `max(280px, 40%)` : `auto`)};

  div:not([class]) {
    flex: 1 1 auto;
    min-height: 240px;
  }

  div:empty {
    min-height: 0;
    height: 0;
  }
`;

export default function PerRequestMatches(props) {
    const {request} = props;
    const [matchingListingsData, setMatchingListingsData] = useState([]);
    const [matchingListingsImgs, setMatchingListingsImgs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMatches, setShowMatches] = useState(false);

    const fetchMatches = useCallback(async () => {
        if (request) {
            const res = await fetch(`${BACKEND_URL}/api/items/getMatchingListingsOf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    requestId: request._id
                })
            });
            const data = await res.json();
            if (data.status === "ok") {
                fetch(`${BACKEND_URL}/api/items/getTheseListingsTexts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        listingIds: data.matchingListings
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "ok") {
                        setMatchingListingsData(data.listingsData);
                        setIsLoading(false);
                    } else {
                        console.log(`Error fetching matching listings' data for request "${request.title}"`);
                    }
                });
                fetch(`${BACKEND_URL}/api/items/getTheseListingsImgs`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        listingIds: data.matchingListings
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "ok") {
                        setMatchingListingsImgs(data.listingsImgs);
                    } else {
                        console.log(`Error fetching matching listings' images for request "${request.title}"`);
                    }
                });
            } else {
                console.log(`Error fetching matching listings for request "${request.title}"`);
            }
        }
    }, [request]);
    useEffect(() => {
        fetchMatches();
    }, [fetchMatches]);

    return (
        <Match show={showMatches}>
            <ListItemButton
              onClick={() => setShowMatches(!showMatches)}
              sx={{display: "flex", flexGrow: 0, alignItems: "center", width: "100%"}}>
                <Typography variant="subtitle2">{request.title}</Typography>
                <Divider variant="middle" sx={{flex: "1 1 auto"}} />
                {showMatches ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <TransitionGroup>
                { showMatches &&
                    <Grow style={{transformOrigin: "center top"}} timeout={750}>
                        <Box display="flex" height="auto">
                            <ItemList
                              ListContainer={MatchesGrid}
                              isLoading={isLoading}
                              buttonText="Borrow it"
                              noItemsText={`No matching listings for "${request?.title}" yet`}
                              itemImages={matchingListingsImgs}
                              itemDatas={matchingListingsData}
                              setItemDatas={setMatchingListingsData} />
                        </Box>
                    </Grow>
                }
            </TransitionGroup>
        </Match>
    );
}