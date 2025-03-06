import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error404 from "../pages/error404/Error404.tsx";
import Homepage from "../pages/home/Homepage.tsx";

const router = createBrowserRouter([
  { path: "/home", element: <Homepage />},
  { path: "/", element: <Homepage />},
  { path: "*", element: <Error404 />},
,
  { path: "/profil", element: <Profil/>}
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
