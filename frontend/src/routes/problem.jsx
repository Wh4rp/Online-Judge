import {
    Outlet,
    Link,
    useLoaderData,
} from "react-router-dom";

import RenderMD from '../components/rendermd'

import { getBySlug } from "../services/problems";

import './problem.css';

export function loader({ params }) {
    return getBySlug(params.problemSlug);
}

const DescriptionProblem = ({ description }) => {
    return (
        <div className="description">
            <RenderMD source={description} />
        </div>
    );
}

const InputProblem = ({ input }) => {
    return (
        <>
            <h2>Input</h2>
            <RenderMD source={input} />
        </>
    );
}

const OutputProblem = ({ output }) => {
    return (
        <>
            <h2>Output</h2>
            <RenderMD source={output} />
        </>
    );
}

const Examples = ({ examples }) => {
    return (
        <div className="example">
            <h2>Examples</h2>
            <ul>
                {examples.map((example) => (
                    <li key={example.id}>
                        <h3>Input</h3>
                        <pre className="input-example">
                            {example.input}
                        </pre>
                        <h3>Output</h3>
                        <pre className="output-example">
                            {example.output}
                        </pre>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const Constraints = ({ time_limit, memory_limit }) => {
    return (
        <div className="problem-constraints">
            <ul>
                <li><b>Time limit</b>: {time_limit.toFixed(2)}s</li>
                <li><b>Memory limit</b>: {memory_limit}MB</li>
            </ul>
        </div>
    );
}

const SubmitSolution = () => {
    return (
        <div className="submit-solution">
            <form className="submit-form">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="language">Language</label>
                            </td>
                            <td>
                                <select name="language" id="language">
                                    <option value="c">C</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                    <option value="python">Python</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="source">Source</label>
                            </td>
                            <td>
                                <textarea name="source" id="source" rows="10" cols="50"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button type="submit">Submit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

const Problem = () => {
    const problem = useLoaderData();
    return (
        <div className="problem-container">
            <h1>{problem.title}</h1>
            <Constraints time_limit={problem.time_limit} memory_limit={problem.memory_limit} />
            <DescriptionProblem description={problem.statement.main} />
            <InputProblem input={problem.statement.input} />
            <OutputProblem output={problem.statement.output} />
            <Examples examples={problem.statement.examples} />
            <hr />
            <SubmitSolution />
        </div>
    );
}

export default Problem;