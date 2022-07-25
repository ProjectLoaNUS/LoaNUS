import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import CreateRewardCard from "../components/Admin/CreateReward/CreateRewardCard";
import ViewListings from "../components/Admin/ViewListings";
import ViewRequests from "../components/Admin/ViewRequests";
import OverView from "../components/Admin/OverView";
import NavBar from "../components/Admin/NavBar";
import { ADMIN, CREATE_REWARD, VIEW_LISTINGS, VIEW_REQUESTS } from "./routes";
import { useAuth } from "../database/auth";

const AdminContentContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding: 1em 0;
`;

export default function AdminPage() {
  const [path, setPath] = useState("");
  const {user} = useAuth();
  const navigate = useNavigate();

  function AdminContent() {
    const location = useLocation();
    setPath(location.pathname);
    switch (location.pathname) {
      case VIEW_LISTINGS:
        return <ViewListings />;
      case VIEW_REQUESTS:
        return <ViewRequests />;
      case CREATE_REWARD:
        return <CreateRewardCard />;
      case ADMIN:
      default:
        return <OverView />;
    }
  }

  useEffect(() => {
    if (user && !user.admin) {
      navigate(-1);
    }
  }, [user]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <NavBar path={path} />
      <AdminContentContainer>
        <AdminContent />
      </AdminContentContainer>
    </Box>
  );
}
