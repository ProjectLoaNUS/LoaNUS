import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NewItemPage from "./pages/NewItemPage";
import SignInPage from "./pages/SignInPage";
import SearchedListings from "./pages/ListingSearchPage";
import { theme } from "./components/Theme";
import { ThemeProvider } from "@mui/material";
import {
  HOME,
  NEW_ITEM,
  PROFILE,
  SIGN_IN,
  SEARCH_LISTINGS,
  PROFILE_POINTS,
  PROFILE_REVIEWS,
  PROFILE_REWARDS_CLAIMED,
  PROFILE_REQUESTS,
} from "./pages/routes";
import PointsPage from "./components/ProfileComps/PointsPage";
import ReviewsPage from "./components/ProfileComps/ReviewsPage";
import RewardsPage from "./components/ProfileComps/RewardsPage";
import RequestsPage from "./components/ProfileComps/RequestsPage";

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path={SIGN_IN} element={<SignInPage />} />
          <Route path={`${PROFILE}/*`} element={<ProfilePage />} />
          <Route path={NEW_ITEM} element={<NewItemPage />} />
          <Route path={SEARCH_LISTINGS} element={<SearchedListings />} />
          <Route exact path={HOME} element={<HomePage />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
