import { create } from "../services/problems";
import { useState, useEffect } from "react";

import './add-problem.css';

const AddProblemForm = () => {
    const [problem, setProblem] = useState({
        data: {
            title: "",
            title_slug: "",
            statement: {
                main: "",
                input: "",
                output: "",
                examples: [
                    {
                        id: 0,
                        input: "",
                        output: "",
                    }
                ]
            },
            time_limit: 1,
            memory_limit: 256,
        },
        checker: {
            custom: false,
            checker: "",
            test_cases: [
                {
                    id: 0,
                    input: "",
                    output: "",
                }
            ]
        }
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChangeData = (e) => {
        const { name, value } = e.target;
        setProblem({
            ...problem,
            data: {
                ...problem.data,
                [name]: value
            }
        });
        console.log('problem', problem)
    };

    const handleChangeStatement = (e) => {
        const { name, value } = e.target;
        setProblem({
            ...problem,
            data: {
                ...problem.data,
                statement: {
                    ...problem.data.statement,
                    [name]: value
                }
            }
        });
        console.log('problem', problem)
    };

    const handleChangeChecker = (e) => {
        const { name, value } = e.target;
        setProblem({
            ...problem,
            checker: {
                ...problem.checker,
                [name]: value
            }
        });
        console.log('problem', problem)
    };

    const handleAddExample = (e) => {
        e.preventDefault();
        setProblem({
            ...problem,
            data: {
                ...problem.data,
                statement: {
                    ...problem.data.statement,
                    examples: [
                        ...problem.data.statement.examples,
                        {
                            id: problem.data.statement.examples.length,
                            input: "",
                            output: "",
                        }
                    ]
                }
            }
        });
    };

    const handleChangeCheckerCustom = (e) => {
        setProblem({
            ...problem,
            checker: {
                ...problem.checker,
                custom: !problem.checker.custom
            }
        });
        console.log('problem', problem)
    };

    const handleAddTestCase = (e) => {
        e.preventDefault();
        setProblem({
            ...problem,
            checker: {
                ...problem.checker,
                test_cases: [
                    ...problem.checker.test_cases,
                    {
                        id: problem.checker.test_cases.length,
                        input: "",
                        output: "",
                    }
                ]
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(validate(problem));
        setIsSubmitting(true);
    };

    useEffect(
        () => {
            if (Object.keys(errors).length === 0 && isSubmitting) {
                create(problem);
            }
        },
        [errors]
    );

    return (
        <div className="add-problem-form">
            <form onSubmit={handleSubmit} noValidate>
                <table>
                    <tbody>
                        <tr key="title">
                            <td>
                                <label htmlFor="title">
                                    Title of the problem
                                </label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    onChange={handleChangeData}
                                />
                                {errors.title && <p>{errors.title}</p>}
                            </td>
                        </tr>
                        <tr key="statement">
                            <td>
                                <label htmlFor="statement">Statement</label>
                            </td>
                            <td>
                                <textarea
                                    name="main"
                                    id="statement"
                                    onChange={handleChangeStatement}
                                />
                                {errors.statement && <p>{errors.statement}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="input">Input</label>
                            </td>
                            <td>
                                <textarea
                                    name="input"
                                    id="input"
                                    onChange={handleChangeStatement}
                                />
                                {errors.input && <p>{errors.input}</p>}
                            </td>
                        </tr>
                        <tr key="output">
                            <td>
                                <label htmlFor="output">Output</label>
                            </td>
                            <td>
                                <textarea
                                    name="output"
                                    id="output"
                                    onChange={handleChangeStatement}
                                />
                                {errors.output && <p>{errors.output}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button type="addExample" onClick={handleAddExample}>
                                    Add Example
                                </button>
                            </td>
                        </tr>
                        {problem.data.statement.examples.map((example) => (
                            <tr key={example.id}>
                                <td>
                                    <label htmlFor="input">Input</label>
                                </td>
                                <td>
                                    <textarea
                                        name="input"
                                        id="input"
                                        onChange={handleChangeData}
                                    />
                                    {errors.input && <p>{errors.input}</p>}
                                </td>
                                <td>
                                    <label htmlFor="output">Output</label>
                                </td>
                                <td>
                                    <textarea
                                        name="output"
                                        id="output"
                                        onChange={handleChangeData}
                                    />
                                    {errors.output && <p>{errors.output}</p>}
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
                                    id="time_limit"
                                    onChange={handleChangeData}
                                />
                                {errors.time_limit && <p>{errors.time_limit}</p>}
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
                                    id="memory_limit"
                                    onChange={handleChangeData}
                                />
                                {errors.memory_limit && <p>{errors.memory_limit}</p>}
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
                                    id="custom"
                                    onClick={handleChangeCheckerCustom}
                                />
                                {errors.custom && <p>{errors.custom}</p>}
                            </td>
                        </tr>
                        <tr key="checker">
                            <td>
                                <label htmlFor="checker">Checker</label>
                            </td>
                            <td>
                                <textarea
                                    name="checker"
                                    id="checker"
                                    onChange={handleChangeChecker}
                                />
                                {errors.checker && <p>{errors.checker}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button type="addTestCase" onClick={handleAddTestCase}>
                                    Add Test Case
                                </button>
                            </td>
                        </tr>
                        {problem.checker.test_cases.map((test_case) => (
                            <tr key={test_case.id}>
                                <td>
                                    <label htmlFor="input">Input</label>
                                </td>
                                <td>
                                    <textarea
                                        name="input"
                                        id="input"
                                        onChange={handleChangeChecker}
                                    />
                                    {errors.input && <p>{errors.input}</p>}
                                </td>
                                <td>
                                    <label htmlFor="output">Output</label>
                                </td>
                                <td>
                                    <textarea
                                        name="output"
                                        id="output"
                                        onChange={handleChangeChecker}
                                    />
                                    {errors.output && <p>{errors.output}</p>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

const AddProblem = () => {
    return (
        <div>
            <h1>Add Problem</h1>
            <AddProblemForm />
        </div>
    );
};

export default AddProblem;