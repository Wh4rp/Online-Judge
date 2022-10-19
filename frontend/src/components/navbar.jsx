import {
    useState,
    useEffect
} from 'react'
import React from 'react'
import { Link } from "react-router-dom"
import './navbar.css'

const NavBar = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedJudgeAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])

    return (
        <div id="navbar">
            <div className='navbar-item'>
                <Link to='/'>Home</Link>
            </div>
            <div className='navbar-item'>
                <Link to='/problems'>Problems</Link>
            </div>
            <div className='navbar-item'>
                <Link to='/add_problem'>Add Problem</Link>
            </div>
            <div className='navbar-item'>
                <Link to='/submissions'>Submissions</Link>
            </div>
            {user === null ? (
                <>
                    <div className='navbar-item-right'>
                        <Link to='/login'>Login</Link>
                    </div>
                    <div className='navbar-item-right'>
                        <Link to='/register'>Register</Link>
                    </div>
                </>
            ) : (
                <>
                    <div className='navbar-item-right'>
                        {user.username}
                    </div>
                    <div className='navbar-item-right'>
                        <Link to='/logout'>Logout</Link>
                    </div>
                </>
            )}

        </div>
    );
}

export default NavBar;