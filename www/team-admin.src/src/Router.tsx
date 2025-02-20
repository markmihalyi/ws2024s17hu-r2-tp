import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/index";
import Login from "./pages/Login";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default Router;
