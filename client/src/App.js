import React, { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NewItemPage from "./pages/NewItemPage";
import SignInPage from "./pages/SignInPage";
import ChatPage from "./pages/ChatPage";
import CategoryListings from "./pages/CategoryPage";
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
  CATEGORY_LISTINGS,
  CLAIM_REWARD,
  ADMIN,
} from "./pages/routes";
import ClaimRewardPage from "./pages/ClaimRewardPage";
import AdminPage from "./pages/AdminPage";
import { useAuth } from "./database/auth";
import { useSocket } from "./utils/socketContext";
import { useNotifications } from "./utils/notificationsContext";

function App() {
  const { user, setUser, setIsUserLoaded } = useAuth();
  const { socket, connectSocket, disconnectSocket } = useSocket();
  const { startNotifications, loadNotifications, notifications } = useNotifications();
  const [ isInitialised, setIsInitialised ] = useState(false);

  const loadNotifs = useCallback(async () => {
    const storedNotifs = localStorage.getItem("notifications");
    if (storedNotifs) {
      try {
        loadNotifications(JSON.parse(storedNotifs));
      } catch (err) {
        console.log(err);
      }
    }
  }, []);
  useEffect(() => {
    loadNotifs();
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.log(err);
        }
      }
      setIsUserLoaded(true);
    }

    return () => {
      disconnectSocket();
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (!isInitialised) {
        if (socket) {
          disconnectSocket();
        }
        connectSocket(user).then(socket => {
          startNotifications(socket);
          setIsInitialised(true);
        });
      }
    } else {
      if (socket) {
        disconnectSocket();
      }
    }
  }, [user]);

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
          <Route path={CATEGORY_LISTINGS} element={<CategoryListings />} />
          <Route path={`${ADMIN}/*`} element={<AdminPage />} />
          <Route exact path={HOME} element={<HomePage />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
