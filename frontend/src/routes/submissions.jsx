import {
    Outlet,
    Link,
    useLoaderData,
} from "react-router-dom";
import { getAllSubmissions } from "../services/submissions";

export async function loader() {
    const submissions = await getAllSubmissions();
    return { submissions };
}

const SubmissionList = () => {
    const { submissions } = useLoaderData();
    return (
        <div>
            <h1>Submissions</h1>
            <ul>
                {submissions.map((submission) => (
                    <li key={submission.id}>
                        <Link to={`/problems/${submission.problem_slug}`}>
                            {submission.problem_slug}
                        </Link>
                        <br />
                        Verdicts
                        <ul>
                            {submission.verdicts.map((verdict) => (
                                <li key={verdict.id}>
                                    {verdict.verdict}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            <Outlet />
        </div>
    );
}

export default SubmissionList;