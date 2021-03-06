import { Box } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import CreateRewardCard from "../components/Admin/CreateReward/CreateRewardCard";
import NavBar from "../components/Admin/NavBar";
import { ADMIN, CREATE_REWARD } from "./routes";

const AdminContentContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding: 1em 0;
`;

export default function AdminPage() {
    const [ path, setPath ] = useState("");

    function AdminContent() {
        const location = useLocation();
        setPath(location.pathname);
        switch (location.pathname) {
            case CREATE_REWARD:
                return <CreateRewardCard />
            case ADMIN:
            default:
                return ""
        }
    }

    return (
        <Box sx={{display: "flex", minHeight: "100vh", flexDirection: "column"}}>
            <NavBar path={path} />
            <AdminContentContainer>
                <AdminContent />
            </AdminContentContainer>
        </Box>
    );
}