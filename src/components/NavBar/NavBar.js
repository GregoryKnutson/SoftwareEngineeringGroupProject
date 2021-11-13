import React from 'react';
import './NavBar.scss'
import { NavLink, useHistory } from 'react-router-dom';
import { destroyAuth } from '../../verifyLogin';

const NavBar = () => {
    const history = useHistory();

    const logout=()=>{
        destroyAuth()
        history.push("/login")
    }

    return (
    <nav>
        <h1>Reservation</h1>
        <ul className = 'nav-links'>
            <NavLink 
                className='nav-item'
                to="/reserve"
                exact
                activeStyle={{
                    fontWeight: 800,
                }}>
                Reserve Table
            </NavLink>
            <NavLink 
                className='nav-item'
                to="/reservations"
                exact
                activeStyle={{
                    fontWeight: 800,
                }}>
                Reservations
            </NavLink>
            <NavLink 
                className='nav-item'
                to="/profile"
                activeStyle={{
                    fontWeight: 800,
                }}>
                Profile Management
            </NavLink>
            <button
                className='signout'
                onClick={logout}
            >
                Sign Out
            </button>

        </ul>
    </nav>
    );
}

export default NavBar;