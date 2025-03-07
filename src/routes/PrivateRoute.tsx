import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error404 from "../pages/error404/Error404.tsx";
import Homepage from "../pages/home/Homepage.tsx";
import { Skills } from "../pages/skills/Skills.tsx";
import Dashboard from "../pages/dashboard/Dashboard.tsx";

const router = createBrowserRouter([
  { path: "/home", element: <Homepage /> },
  { path: "/skills", element: <Skills /> },
  { path: "/dashboard", element: <Dashboard />}, 
  { path: "/", element: <Homepage /> },
  { path: "*", element: <Error404 /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
