import React from 'react';
import './NavBar.scss'
import { NavLink, useHistory } from 'react-router-dom';
import { destroyAuth } from '../../verifyLogin';

const NavBar = () => {

    return (
    <nav>
        <h1>Reservation</h1>
        <ul className = 'nav-links'>
            <NavLink 
                className='nav-item'
                to="/guest"
                exact
                activeStyle={{
                    fontWeight: 800,
                }}>
                Reserve Table
            </NavLink>
            <NavLink 
                className='nav-item'
                to="/login"
                exact
                activeStyle={{
                    fontWeight: 800,
                }}>
                Sign In
            </NavLink>

        </ul>
    </nav>
    );
}

export default NavBar;