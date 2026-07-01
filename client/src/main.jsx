import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import { store } from "./redux/store";

import App from "./App";

import "./index.css";

import "leaflet/dist/leaflet.css";
import "./utils/fixLeafletIcons";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161f38",
            color: "#f3f5fa",
            border: "1px solid #232f4d",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#1fd9a8", secondary: "#0a0e17" } },
          error: { iconTheme: { primary: "#ff4d4f", secondary: "#0a0e17" } },
        }}
      />
      <App />
    </Provider>
  </React.StrictMode>
);