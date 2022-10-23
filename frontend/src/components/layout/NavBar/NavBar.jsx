import React from 'react'
import { useEffect } from 'react'
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'

import { login } from '@store/authentication'

import Logo from '/JuezOnline.svg'

import './NavBar.css'

const NavBar = () => {
    const loggedIn = useSelector(state => state.user.loggedIn)
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedJudgeAppUser')
        if (loggedUserJSON) {
            console.log('find')
            const userJSON = JSON.parse(loggedUserJSON)
            dispatch(login(userJSON))
        }
        console.log('user', user)
        console.log('loggedIn', loggedIn)
    }, [])

    return (
        <div id="navbar">
            <div className='navbar-left-container'>
                <Link to='/' className='navbar-logo'>
                    <img src={Logo} alt="Logo" />
                </Link>
                <Link to='/problems' className='navbar-item'>
                    Problems
                </Link>
                <Link to='/add_problem' className='navbar-item'>
                    Add Problem
                </Link>
                <Link to='/submissions' className='navbar-item'>
                    Submissions
                </Link>
            </div>

            <div className='navbar-right-container'>
                {loggedIn ?
                    user.username
                    :
                    <Link to='/login' className='navbar-item'>
                        Login
                    </Link>
                }
                {loggedIn ?
                    <Link to='/logout' className='navbar-item'>
                        Logout
                    </Link>
                    :
                    <Link to='/register' className='navbar-item'>
                        Register
                    </Link>
                }
            </div>
        </div>
    )
}

export default NavBar