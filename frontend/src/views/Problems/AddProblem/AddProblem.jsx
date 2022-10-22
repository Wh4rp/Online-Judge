import { createProblem } from '@services/problems'
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

import './AddProblem.css'

const AddProblemForm = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [statement_main, setStatementMain] = useState("")
    const [statement_input, setStatementInput] = useState("")
    const [statement_output, setStatementOutput] = useState("")
    const [statement_examples, setStatementExamples] = useState([
        {
            id: 0,
            input: "",
            output: "",
        }
    ])
    const [time_limit, setTimeLimit] = useState(1)
    const [memory_limit, setMemoryLimit] = useState(256)
    const [custom, setCustom] = useState(false)
    const [checker, setChecker] = useState("")
    const [test_cases, setTestCases] = useState([
        {
            id: 0,
            input: "",
            output: "",
        }
    ])

    const [errors, setErrors] = useState('')

    const handleAddExample = (e) => {
        e.preventDefault()
        setStatementExamples([...statement_examples, {
            id: statement_examples.length,
            input: "",
            output: "",
        }])
    }

    const handleAddTestCase = (e) => {
        e.preventDefault()
        setTestCases([
            ...test_cases,
            {
                id: test_cases.length,
                input: "",
                output: "",
            }
        ])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Sent problem')
        const newProblem = {
            name,
            statement: {
                main: statement_main,
                input: statement_input,
                output: statement_output,
                examples: statement_examples,
            },
            time_limit,
            memory_limit,
            custom,
            checker,
            test_cases
        }
        createProblem(newProblem)
            .then(res => {
                console.log(res)
                navigate('/problems')
            })
            .catch(err => {
                    console.log(err)
                    setErrors(err)
                }
            )
    }

    return (
        <div className="add-problem-form">
            {errors && <div className="errors">{errors}</div>}
            <form onSubmit={handleSubmit} noValidate>
                <table>
                    <tbody>
                        <tr key="name">
                            <td>
                                <label htmlFor="name">
                                    Name of the problem
                                </label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={({ target }) => setName(target.value)}
                                />
                            </td>
                        </tr>
                        <tr key="statement">
                            <td>
                                <label htmlFor="statement">Statement</label>
                            </td>
                            <td>
                                <textarea
                                    name="statement"
                                    value={statement_main}
                                    onChange={({ target }) => setStatementMain(target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="input">Input</label>
                            </td>
                            <td>
                                <textarea
                                    name="input"
                                    value={statement_input}
                                    onChange={({ target }) => setStatementInput(target.value)}
                                />
                            </td>
                        </tr>
                        <tr key="output">
                            <td>
                                <label htmlFor="output">Output</label>
                            </td>
                            <td>
                                <textarea
                                    name="output"
                                    value={statement_output}
                                    onChange={({ target }) => setStatementOutput(target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="examples">Examples</label>
                            </td>
                            <td>
                                <button type="addExample" onClick={handleAddExample}>
                                    Add Example
                                </button>
                            </td>
                        </tr>
                        {statement_examples.map((example) => (
                            <tr key={example.id}>
                                <td>
                                    <label htmlFor="input">Input</label>
                                </td>
                                <td>
                                    <textarea
                                        name="input"
                                        value={example.input}
                                        onChange={({ target }) => {
                                            const newExamples = [...statement_examples]
                                            newExamples[example.id].input = target.value
                                            setStatementExamples(newExamples)
                                        }}
                                    />
                                </td>
                                <td>
                                    <label htmlFor="output">Output</label>
                                </td>
                                <td>
                                    <textarea
                                        name="output"
                                        value={example.output}
                                        onChange={({ target }) => {
                                            const newExamples = [...statement_examples]
                                            newExamples[example.id].output = target.value
                                            setStatementExamples(newExamples)
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr key="time_limit">
                            <td>
                                <label htmlFor="time_limit">Time Limit</label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="time_limit"
                                    value={time_limit}
                                    onChange={({ target }) => setTimeLimit(target.value)}
                                />
                            </td>
                        </tr>
                        <tr key="memory_limit">
                            <td>
                                <label htmlFor="memory_limit">Memory Limit</label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="memory_limit"
                                    value={memory_limit}
                                    onChange={({ target }) => setMemoryLimit(target.value)}
                                />
                            </td>
                        </tr>
                        <tr key="custom">
                            <td>
                                <label htmlFor="custom">Custom Checker</label>
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    name="custom"
                                    value={custom}
                                    onChange={({ target }) => setCustom(target.checked)}
                                />
                            </td>
                        </tr>
                        <tr key="checker">
                            <td>
                                <label htmlFor="checker">Checker</label>
                            </td>
                            <td>
                                <textarea
                                    name="checker"
                                    value={checker}
                                    onChange={({ target }) => setChecker(target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="examples">Examples</label>
                            </td>
                            <td>
                                <button type="addTestCase" onClick={handleAddTestCase}>
                                    Add Test Case
                                </button>
                            </td>
                        </tr>
                        {test_cases.map((test_case) => (
                            <tr key={test_case.id}>
                                <td>
                                    <label htmlFor="input">Input</label>
                                </td>
                                <td>
                                    <textarea
                                        name="input"
                                        value={test_case.input}
                                        onChange={({ target }) => {
                                            const newTestCases = [...test_cases]
                                            newTestCases[test_case.id].input = target.value
                                            setTestCases(newTestCases)
                                        }}
                                    />
                                </td>
                                <td>
                                    <label htmlFor="output">Output</label>
                                </td>
                                <td>
                                    <textarea
                                        name="output"
                                        value={test_case.output}
                                        onChange={({ target }) => {
                                            const newTestCases = [...test_cases]
                                            newTestCases[test_case.id].output = target.value
                                            setTestCases(newTestCases)
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

const AddProblem = () => {
    return (
        <div>
            <h1>Add Problem</h1>
            <AddProblemForm />
        </div>
    )
}

export default AddProblem