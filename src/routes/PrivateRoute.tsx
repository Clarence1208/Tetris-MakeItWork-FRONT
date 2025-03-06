import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "../pages/home/homepage";
import Profil from "../pages/profil/profil";


const router = createBrowserRouter([
  { path: "/home", element: <Homepage />},
  { path: "/profil", element: <Profil/>}
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
