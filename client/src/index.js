import React from "react";
import { HashRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./database/auth";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <AuthProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AuthProvider>
  </Provider>
);
