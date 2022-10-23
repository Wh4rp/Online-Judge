import MDEditor from '@uiw/react-md-editor';

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
            })
    }

    return (
        <>
            {errors && <div className="errors">{errors}</div>}
            <form onSubmit={handleSubmit} noValidate className="add-problem-form">
                <div className="problem-form-section">
                    <label htmlFor="name" className="section-item">
                        Problem name
                    </label>
                    <input
                        className="section-item input-name"
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="problem-form-section">
                    <label htmlFor="statement" className="section-item">Statement</label>
                    <div className="section-item__md-editor">
                        <MDEditor value={statement_main} onChange={setStatementMain} />
                    </div>
                </div>
                <div className="problem-form-section">
                    <label htmlFor="input" className="section-item">Input Format</label>
                    <div className="section-item__md-editor">
                        <MDEditor value={statement_input} onChange={setStatementInput} />
                    </div>
                </div>
                <div className="problem-form-section">
                    <label htmlFor="output" className="section-item">Output Format</label>
                    <div className="section-item__md-editor">
                        <MDEditor className='md-editor' value={statement_output} onChange={setStatementOutput} />
                    </div>
                </div>
                <div className="problem-form-section">
                    <label htmlFor="examples" className="section-item">Examples</label>
                    <button type="addExample" onClick={handleAddExample}>
                        Add Example
                    </button>
                </div>
                {statement_examples.map((example) => (
                    <div key={example.id} className="problem-form-section">
                        <label htmlFor="input" className="section-item">Input</label>
                        <textarea
                            className="section-item"
                            name="input"
                            value={example.input}
                            onChange={({ target }) => {
                                const newExamples = [...statement_examples]
                                newExamples[example.id].input = target.value
                                setStatementExamples(newExamples)
                            }}
                        />
                        <label htmlFor="output" className="section-item">Output</label>
                        <textarea
                            className="section-item"
                            name="output"
                            value={example.output}
                            onChange={({ target }) => {
                                const newExamples = [...statement_examples]
                                newExamples[example.id].output = target.value
                                setStatementExamples(newExamples)
                            }}
                        />
                    </div>
                ))}
                <div className="problem-form-section">
                    <label htmlFor="time_limit" className="section-item">Time Limit (seconds) </label>
                    <select
                        className="section-item"
                        name="time_limit"
                        value={time_limit}
                        onChange={({ target }) => setTimeLimit(target.value)}
                    >
                        {[...Array(10).keys()].map((i) => (
                            <option key={i} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="problem-form-section">
                    <label htmlFor="memory_limit" className="section-item">Memory Limit (megabytes) </label>
                    <select
                        className="section-item"
                        name="memory_limit"
                        value={memory_limit}
                        onChange={({ target }) => setMemoryLimit(target.value)}
                    >
                        <option value="128">128</option>
                        <option value="256">256</option>
                        <option value="512">512</option>
                        <option value="1024">1024</option>
                    </select>
                </div>
                <div className="problem-form-section">
                    <label htmlFor="custom" className="section-item">Custom Checker</label>
                    <input
                        className="section-item"
                        type="checkbox"
                        name="custom"
                        value={custom}
                        onChange={({ target }) => setCustom(target.checked)}
                    />
                </div>
                <div className="problem-form-section">
                    <label htmlFor="checker" className="section-item">Checker</label>
                    <textarea
                        className="section-item"
                        name="checker"
                        value={checker}
                        onChange={({ target }) => setChecker(target.value)}
                    />
                </div>
                <div className="problem-form-section">
                    <label htmlFor="examples" className="section-item">Examples</label>
                    <button type="addTestCase" onClick={handleAddTestCase}>
                        Add Test Case
                    </button>
                </div>
                {test_cases.map((test_case) => (
                    <div key={test_case.id} className="problem-form-section">
                        <label htmlFor="input" className="section-item">Input</label>
                        <textarea
                            className="section-item"
                            name="input"
                            value={test_case.input}
                            onChange={({ target }) => {
                                const newTestCases = [...test_cases]
                                newTestCases[test_case.id].input = target.value
                                setTestCases(newTestCases)
                            }}
                        />
                        <label htmlFor="output" className="section-item">Output</label>
                        <textarea
                            className="section-item"
                            name="output"
                            value={test_case.output}
                            onChange={({ target }) => {
                                const newTestCases = [...test_cases]
                                newTestCases[test_case.id].output = target.value
                                setTestCases(newTestCases)
                            }}
                        />
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </>
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