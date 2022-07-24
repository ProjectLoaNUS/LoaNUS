import { Box } from "@mui/material";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import PerRequestMatches from "./PerRequestMatches";

const Matches = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
  height: 100%;
`;

export default function AllMatches(props) {
    const {requests} = props;
    const [matchedRequests, setMatchedRequests] = useState([]);
    
    const filterRequests = useCallback(async () => {
        if (requests?.length) {
            console.log("hi")
            requests.forEach(request => {
                const matchingListings = request.matchingListings;
                // Current request has matching item listings
                if (matchingListings?.length) {
                    // Add it to the list of requests with matching listings
                    setMatchedRequests(prevRequests => {
                        return [...prevRequests, request];
                    });
                }
            });
        }
    }, [requests]);
    useEffect(() => {
        filterRequests();
    }, [filterRequests]);

    return (
        <Matches>
            { matchedRequests.length ? matchedRequests.map(request => {
                return <PerRequestMatches request={request} />
            }) :
                null
            }
        </Matches>
    );
}