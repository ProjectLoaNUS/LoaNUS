import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NewItemPage from "./pages/NewItemPage";
import SignInPage from "./pages/SignInPage";
import ChatPage from "./pages/ChatPage";
import SearchedListings from "./pages/ListingSearchPage";
import { theme } from "./components/Theme";
import { ThemeProvider } from "@mui/material";
import {
  HOME,
  NEW_ITEM,
  PROFILE,
  SIGN_IN,
  SEARCH_LISTINGS,
  CHAT,
  CLAIM_REWARD,
  CREATE_REWARD,
  ADMIN,
} from "./pages/routes";
import ClaimRewardPage from "./pages/ClaimRewardPage";
import CreateRewardPage from "./pages/CreateRewards";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path={SIGN_IN} element={<SignInPage />} />
          <Route path={CLAIM_REWARD} element={<ClaimRewardPage />} />
          <Route path={CHAT} element={<ChatPage />} />
          <Route path={`${PROFILE}/*`} element={<ProfilePage />} />
          <Route path={NEW_ITEM} element={<NewItemPage />} />
          <Route path={SEARCH_LISTINGS} element={<SearchedListings />} />
          <Route path={`${ADMIN}/*`} element={<AdminPage />} />
          <Route exact path={HOME} element={<HomePage />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
