import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";
import { RouterProvider } from "react-router-dom";
import Router from "./Router";
import axios from "axios";

axios.defaults.baseURL = "http://backend-2.localhost";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={Router} />);
