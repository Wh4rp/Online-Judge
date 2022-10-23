import {
    Link,
    useLoaderData,
} from "react-router-dom"

import './ProblemList.css'

const ProblemList = () => {
    const problems = useLoaderData()
    return (
        <>
            <h1>Problems</h1>
            <div id="problem-list">
                <div id="problem-list-header">
                    <div id="problem-list-header__title">Name</div>
                    <div id="problem-list-header__submissions">Submissions</div>
                </div>
                {problems.map((problem) => (
                    ProblemItem(problem)
                ))}
            </div>
        </>
    )
}

const ProblemItem = (problem) => {

    return (
        <div className="problem-item" key={problem.id}>
            <div className="vertical-line"/>
            <div className="problem-item__title">
                <Link to={`/problems/${problem.name_slug}`}>
                    {problem.name}
                </Link>
            </div>
            <div className="problem-item__submissions">
                {problem.submissions.length}
            </div>
        </div>
    )
}

export default ProblemList