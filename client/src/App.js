import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NewItemPage from "./pages/NewItemPage";
import SignInPage from "./pages/SignInPage";
import RewardsPage from "./pages/RewardsPage";
import { theme } from "./components/Theme";
import { ThemeProvider } from "@mui/material";

function App() {
  return (
    <div>
      <ThemeProvider theme={ theme }>
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/new-item" element={<NewItemPage />} />
          <Route path="/view-rewards" element={<RewardsPage />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
