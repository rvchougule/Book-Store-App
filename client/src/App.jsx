import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import { Contact } from "lucide-react";
import Layout from "./pages/Layout";
export default function App() {
  //

  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            {
              path: "/",
              element: <Home />,
            },
            {
              path: "/shop",
              element: <Shop />,
            },
            {
              path: "/contact",
              element: <Contact />,
            },
          ],
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}
