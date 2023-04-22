import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";
import App from "./App";
import axios from "axios";
import { DataProvider } from "./common/providers/DataProvider";

axios.defaults.baseURL = "http://backend-2.localhost/api/v1";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <DataProvider>
    <App />
  </DataProvider>
);
