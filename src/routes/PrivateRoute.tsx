import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "../pages/home/homepage";
import Error404 from "../pages/error404/Error404.tsx";

const router = createBrowserRouter([
  { path: "/home", element: <Homepage />},
  { path: "/", element: <Homepage />},
  { path: "*", element: <Error404 />},

]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
