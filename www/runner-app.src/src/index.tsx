import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";
import axios from "axios";
import App from "./App";
import { DataProvider } from "./common/providers/DataProvider";

axios.defaults.baseURL = "http://backend-2.localhost";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <DataProvider>
    <App />
  </DataProvider>
);
