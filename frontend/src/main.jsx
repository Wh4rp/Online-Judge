// Import React libraries
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom"

// Import stylesheets
import './index.css'

// Import components
import Root from "./routes/root";
import ErrorPage from "./error-page";
import AppLayout from './components/applayout';
import ProblemList from './routes/problem-list';
import Problem from './routes/problem';

// Import loaders and helpers
import { loader as problemsLoader } from "./routes/problem-list";
import { loader as problemLoader } from "./routes/problem";

// Create and configure the router
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Root />,
      },
      {
        path: "/problems/",
        element: <ProblemList />,
        loader: problemsLoader,
      },
      {
        path: "/problems/:problemId",
        element: <Problem />,
        loader: problemLoader,
      }
    ],
  },
])

// Render the router
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
