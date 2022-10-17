import React from 'react'
import { Link } from "react-router-dom"
import './navbar.css'

const NavBar = () => {
    return (
        <div id="navbar">
            <div className='navbar-item'>
                <Link to='/'>Home</Link>
            </div>
            <div className='navbar-item'>
                <Link to='/problems'>Problems</Link>
            </div>
            <div className='navbar-item'>
                <Link to='/add-problem'>Add Problem</Link>
            </div>
            <div className='navbar-item'>
                <Link to='/submissions'>Submissions</Link>
            </div>
        </div>
    );
}

export default NavBar;