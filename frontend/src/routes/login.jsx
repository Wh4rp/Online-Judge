import {
    useState,
    useEffect
} from 'react'
import login from '../services/auth/login'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedJudgeAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const user = await login({
                username,
                password
            })

            window.localStorage.setItem(
                'loggedJudgeAppUser', JSON.stringify(user)
            )
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            console.log('exception', exception)
            setMessage('Wrong credentials')
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    const loginForm = () => (
        < form onSubmit={handleLogin} >
            {message}
            <table>
                <tbody>
                    <tr>
                        <td>Username</td>
                        <td><input
                            type="username"
                            value={username}
                            name="Username"
                            onChange={({ target }) => setUsername(target.value)}
                        /></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input
                            type="password"
                            value={password}
                            name="Password"
                            onChange={({ target }) => setPassword(target.value)}
                        />
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button onClick={handleLogin}>Login</button></td>
                    </tr>
                </tbody>
            </table>
        </form >
    )

    return (
        <div>
            <h1>Login</h1>
            {user === null ? loginForm() : `You are ready logged in as ${user.username}`}
        </div>
    );
}

export default Login