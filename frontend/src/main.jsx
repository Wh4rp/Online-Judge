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
import SubmissionList from './routes/submissions-list';
import Submission from './routes/submission';
import AddProblem from './routes/add-problem';

// Import loaders and helpers
import { loader as problemsLoader } from "./routes/problem-list";
import { loader as problemLoader } from "./routes/problem";
import { loader as submissionLoader } from "./routes/submissions-list";
import { loader as submissionDetailsLoader } from "./routes/submission";

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
        path: "/problems/:problemSlug",
        element: <Problem />,
        loader: problemLoader,
      },
      {
        path: "add-problem",
        element: <AddProblem />,
      },
      {
        path: "/submissions",
        element: <SubmissionList />,
        loader: submissionLoader,
      },
      {
        path: "/submissions/:submissionId",
        element: <Submission />,
        loader: submissionDetailsLoader,
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
