import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Error404 from "../pages/error404/Error404.tsx";
import Homepage from "../pages/home/Homepage.tsx";
import { Skills } from "../pages/skills/Skills.tsx";
import Cookies from "js-cookie";
import { ReactNode } from "react";
import { Auth } from "../pages/auth/Auth.tsx";
import App from "../App.tsx";

export const AuthRoute = ({ children }: { children: ReactNode }) => {
  const isLogged = Cookies.get("token");
  return isLogged ? <Navigate to="/" /> : children;
};

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const isLogged = Cookies.get("token");
  return isLogged ? children : <Navigate to="/auth" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/auth",
        element: (
          <AuthRoute>
            <Auth />
          </AuthRoute>
        ),
      },
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Outlet />
          </PrivateRoute>
        ),
        children: [
          { path: "/home", element: <Homepage /> },
          { path: "/skills", element: <Skills /> },
          {path: "/profil", element: <Profil/>},

        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
