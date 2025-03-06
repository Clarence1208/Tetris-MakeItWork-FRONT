import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "../pages/home/homepage";

const router = createBrowserRouter([
  { path: "/home", element: <Homepage />}
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
