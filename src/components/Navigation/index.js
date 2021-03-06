import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const Navigation = ({ authUser }) => (
    <nav className="navbar navbar-light bg-light">
        <div className="container">
            <Link to={ROUTES.LANDING} className="navbar-brand">Notepad</Link>
            <ul className="nav">
                <li className="nav-item">
                    <Link to={ROUTES.SIGN_UP} className="nav-link">Sign Up</Link>
                </li>
                <li className="nav-item">
                    <Link to={ROUTES.LOGIN} className="nav-link">Login</Link>
                </li>
            </ul>
        </div>
    </nav>
);

export default Navigation;
