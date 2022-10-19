import {
    useState
} from 'react';
import { useNavigate } from 'react-router-dom'
import register from '../services/auth/register'
import login from '../services/auth/login'

const Register = () => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await register({
                username, name, password
            })

            const user = await login({
                username, password
            })

            window.localStorage.setItem(
                'loggedJudgeAppUser', JSON.stringify(user)
            )
            useNavigate('/')
        }
        catch (error) {
            setError('Wrong credentials')

            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    }

    return (
        <>
            <h1>Register</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td>Username:</td>
                            <td><input type="text" value={username} onChange={({ target }) => setUsername(target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Name:</td>
                            <td><input type="text" value={name} onChange={({ target }) => setName(target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Password:</td>
                            <td><input type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></td>
                        </tr>
                    </tbody>
                </table>
                <button type="submit">Register</button>
            </form>
        </>
    );
}

export default Register