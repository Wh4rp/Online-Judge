import {
    useState,
    useEffect
} from 'react'
import React from 'react'
import { Link } from "react-router-dom"

import { useDispatch, useSelector } from 'react-redux'
import { login } from '../reducers/userReducer'

import Logo from '../../public/JuezOnline.svg'

import './navbar.css'

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
                <div className='navbar-logo'>
                    <Link to='/'>
                        <img src={Logo} alt="Logo" />
                    </Link>
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
            </div>

            <div className='navbar-right-container'>
                <div className='navbar-item'>
                    {loggedIn ? user.username : <Link to='/login'>Login</Link>}
                </div>
                <div className='navbar-item'>
                    {loggedIn ?
                        <Link to='/logout'>Logout</Link>
                        :
                        <Link to='/register'>Register</Link>
                    }
                </div>
            </div>
        </div>
    )
}

export default NavBar;