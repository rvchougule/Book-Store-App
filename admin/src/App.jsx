import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import { useAuthContext } from "./hooks/useAuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ListItems from "./components/books/ListItems";
import Orders from "./components/Orders";
import Category from "./components/category/Category";

function App() {
  const { accessToken } = useAuthContext();

  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "/",
          element: accessToken ? <Home /> : <Navigate to="/login" />,
          children: [
            {
              path: "/",
              element: <Dashboard />,
            },
            {
              path: "/list-items",
              element: <ListItems />,
            },
            {
              path: "/orders",
              element: <Orders />,
            },
            {
              path: "/category",
              element: <Category />,
            },
          ],
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/login",
          element: !accessToken ? <Login /> : <Navigate to="/" />,
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

export default App;
