import { Box } from "@mui/material";
import NavBar from "../components/Admin/NavBar";

export default function AdminPage() {
    return (
        <Box sx={{display: "flex", minHeight: "100vh", flexDirection: "column"}}>
            <NavBar />
        </Box>
    );
}