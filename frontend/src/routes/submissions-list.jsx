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
            <table>
                <thead>
                    <tr>
                        <th>Submission Time</th>
                        <th>Problem</th>
                        <th>Language</th>
                        <th>Status</th>
                        <th>Verdict</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission) => (
                        <tr key={submission.id}>
                            <SubmissionItem {...submission} />
                        </tr>
                    ))}
                </tbody>
            </table>
            <Outlet />
        </div>
    );
}

const SubmissionItem = ({ id, problem_title, problem_slug, submission_time, language, status, global_verdict }) => {
    return (
        <>
            <td>{`${submission_time.split('T')[0]} ${submission_time.split('T')[1].split('.')[0]}`}</td>
            <td>
                <Link to={`/problems/${problem_slug}`}>{problem_title}</Link>
            </td>
            <td>{language}</td>
            <td>{status}</td>
            <td>{global_verdict}</td>
            <td>
                <Link to={`/submissions/${id}/`}>Details</Link>
            </td>
        </>
    );
}

export default SubmissionList;