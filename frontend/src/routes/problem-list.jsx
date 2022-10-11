import {
    Outlet,
    Link,
    useLoaderData,
} from "react-router-dom";
import { getAll } from "../services/problems";

export async function loader() {
    const problems = await getAll();
    return { problems };
}

const ProblemList = () => {
    const { problems } = useLoaderData();
    return (
        <div>
            <h1>Problems</h1>
            <ul>
                {problems.map((problem) => (
                    <li key={problem.id}>
                        <Link to={`/problems/${problem.id}`}>
                            {problem.title}
                        </Link>
                    </li>
                ))}
            </ul>
            <Outlet />
        </div>
    );
}

export default ProblemList;