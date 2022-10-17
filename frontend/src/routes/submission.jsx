import {
    Outlet,
    Link,
    useLoaderData,
} from "react-router-dom";
import { getSubmission } from "../services/submissions";

export async function loader({ params }) {
    const submission = await getSubmission(params.submissionId);
    return { submission };
}

const Submission = () => {
    const { submission } = useLoaderData();
    return (
        <div>
            <h1>Submission {submission.id}</h1>
            <CodeSubmission code={submission.code} />
            <SubmissionInfo submission={submission} />
            <SubmissionTestCases verdicts={submission.verdicts} />
            <Outlet />
        </div>
    );
}

const CodeSubmission = ({ code }) => {
    return (
        <>
            <h2>Code</h2>
            <pre className="code-submission">
                {code}
            </pre>
        </>
    );
}

const SubmissionInfo = ({ submission }) => {
    return (
        <>
            <h2>Submission Info</h2>
            <ul>
                <li>Problem: {submission.problem_title}</li>
                <li>Language: {submission.language}</li>
                <li>Verdict: {submission.verdict}</li>
                <li>Time: {submission.time_execution}</li>
                <li>Memory: {submission.memory_execution}</li>
            </ul>
        </>
    );
}

const SubmissionTestCases = ({ verdicts }) => {
    return (
        <>
            <h2>Test Cases Verdicts</h2>
            <table>
                <thead>
                    <tr>
                        <th>test</th>
                        <th>verdict</th>
                        <th>time</th>
                        <th>memory</th>
                    </tr>
                </thead>
                <tbody>
                    {verdicts.map((verdict) => (
                        <SubmitTestCaseVerdict key={verdict.id} verdict={verdict} />
                    ))}
                </tbody>
            </table>
        </>
    );
}

const SubmitTestCaseVerdict = ({ verdict }) => {
    return (
        <tr>
            <td>{verdict.test_case}</td>
            <td>{verdict.verdict}</td>
            <td>{verdict.time_execution}</td>
            <td>{verdict.memory_execution}</td>
        </tr>
    );
}

export default Submission;