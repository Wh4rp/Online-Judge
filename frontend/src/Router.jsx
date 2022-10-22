import { createBrowserRouter } from "react-router-dom"

import AppLayout from '@components/layout'
import ErrorPage from '@components/error'
import {
    Home,
    ProblemList,
    Problem,
    AddProblem,
    SubmissionList,
    Submission,
    Login,
    Register,
    Logout,
} from '@views'

import { getAllProblems as ProblemListLoader } from '@services/problems'
import { getBySlugProblem as ProblemLoader } from '@services/problems'
import { getAllSubmissions as SubmissionListLoader } from '@services/submissions'
import { getByIdSubmission as SubmissionLoader } from '@services/submissions'

const Router = createBrowserRouter([
    {
        element: <AppLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/problems/",
                element: <ProblemList />,
                loader: ProblemListLoader,
            },
            {
                path: "/problems/:problemSlug",
                element: <Problem />,
                loader: ({ params }) => ProblemLoader(params.problemSlug),
            },
            {
                path: "add_problem",
                element: <AddProblem />,
            },
            {
                path: "/submissions",
                element: <SubmissionList />,
                loader: SubmissionListLoader,
            },
            {
                path: "/submissions/:submissionId",
                element: <Submission />,
                loader: ({ params }) => SubmissionLoader(params.submissionId),
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/logout",
                element: <Logout />,
            },
        ],
    },
])

export default Router