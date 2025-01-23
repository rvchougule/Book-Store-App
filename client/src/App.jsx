import { createBrowserRouter, RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import { Contact } from "lucide-react";
import Layout from "./pages/Layout";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
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
            {
              path: "/cart",
              element: <Cart />,
            },
            {
              path: "/place-order",
              element: <PlaceOrder />,
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
