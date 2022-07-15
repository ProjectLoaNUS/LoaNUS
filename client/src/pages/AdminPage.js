import { Box } from "@mui/material";
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
    function AdminContent() {
        const location = useLocation();
        const path = location.pathname;
        switch (path) {
            case CREATE_REWARD:
                return <CreateRewardCard />
            case ADMIN:
            default:
                return ""
        }
    }

    return (
        <Box sx={{display: "flex", minHeight: "100vh", flexDirection: "column"}}>
            <NavBar />
            <AdminContentContainer>
                <AdminContent />
            </AdminContentContainer>
        </Box>
    );
}