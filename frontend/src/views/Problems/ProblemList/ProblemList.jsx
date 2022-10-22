import {
    Link,
    useLoaderData,
} from "react-router-dom"

const ProblemList = () => {
    const problems = useLoaderData()
    return (
        <div>
            <h1>Problems</h1>
            <ul>
                {problems.map((problem) => (
                    <li key={problem.id}>
                        <Link to={`/problems/${problem.name_slug}`}>
                            {problem.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ProblemList