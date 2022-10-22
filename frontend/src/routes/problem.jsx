import {
    Outlet,
    Link,
    useLoaderData,
    useNavigate,
} from "react-router-dom"

import { useState, useEffect } from "react"

import RenderMD from '../components/rendermd'

import { getBySlug } from "../services/problems"

import './problem.css'

import { createSubmission, setToken } from "../services/submissions"

export function loader({ params }) {
    return getBySlug(params.problemSlug)
}

const DescriptionProblem = ({ description }) => {
    return (
        <div className="description">
            <RenderMD source={description} />
        </div>
    )
}

const InputProblem = ({ input }) => {
    return (
        <>
            <h2>Input</h2>
            <RenderMD source={input} />
        </>
    )
}

const OutputProblem = ({ output }) => {
    return (
        <>
            <h2>Output</h2>
            <RenderMD source={output} />
        </>
    )
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
    )
}

const Constraints = ({ time_limit, memory_limit }) => {
    return (
        <div className="problem-constraints">
            <ul>
                <li><b>Time limit</b>: {time_limit.toFixed(2)}s</li>
                <li><b>Memory limit</b>: {memory_limit}MB</li>
            </ul>
        </div>
    )
}

const SubmitSolution = ({ problem, user }) => {
    const navigate = useNavigate()

    const [submission, setSubmission] = useState({
        code: '',
        user_id: user ? user.id : null,
        language: 'c',
        problem_name_slug: problem.name_slug,
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        createSubmission(submission)
            .then((res) => {
                console.log('response', res)
                navigate(`/submissions`)
            })
    }

    const handleChange = (e) => {
        console.log(submission)
        setSubmission({
            ...submission,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="submit-solution">
            <form className="submit-form" onSubmit={handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="language">Language</label>
                            </td>
                            <td>
                                <select name="language" id="language" onChange={handleChange}>
                                    <option value="c">C</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                    <option value="python">Python</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="code">Code</label>
                            </td>
                            <td>
                                <textarea name="code" id="source" rows="10" cols="50" onChange={handleChange}></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button type="submit" onClick={handleSubmit} disabled={user === null}>Submit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}

const Problem = () => {
    const problem = useLoaderData()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedJudgeAppUser')
        if (loggedUserJSON) {
            console.log('logged user', loggedUserJSON)
            const userJSON = JSON.parse(loggedUserJSON)
            setUser(userJSON)
            setToken(userJSON.token)
        }
    }, [])

    return (
        <div className="problem-container">
            <h1>{problem.name}</h1>
            <Constraints time_limit={problem.time_limit} memory_limit={problem.memory_limit} />
            <DescriptionProblem description={problem.statement.main} />
            <InputProblem input={problem.statement.input} />
            <OutputProblem output={problem.statement.output} />
            <Examples examples={problem.statement.examples} />
            <hr />
            <SubmitSolution problem={problem} user={user} />
        </div>
    )
}

export default Problem