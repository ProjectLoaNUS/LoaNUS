import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NewItemPage from "./pages/NewItemPage";
import SignInPage from "./pages/SignInPage";
import RewardsPage from "./pages/RewardsPage";
import SearchedListings from "./pages/ListingSearchPage";
import { theme } from "./components/Theme";
import { ThemeProvider } from "@mui/material";
import { HOME, NEW_ITEM, PROFILE, REWARDS, SIGN_IN, SEARCH_LISTINGS } from "./pages/routes";

function App() {
  return (
    <div>
      <ThemeProvider theme={ theme }>
        <Routes>
          <Route path={SIGN_IN} element={<SignInPage />} />
          <Route path={HOME} element={<HomePage />} />
          <Route path={PROFILE} element={<ProfilePage />} />
          <Route path={NEW_ITEM} element={<NewItemPage />} />
          <Route path={REWARDS} element={<RewardsPage />} />
          <Route path={SEARCH_LISTINGS} element={<SearchedListings />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
