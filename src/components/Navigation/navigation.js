import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut/signout';
import * as ROUTES from '../../constants/routes';

const Navigation = ({ authUser }) => (
    <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
);

const NavigationAuth = () => (
    <ul className="nav flex-column">
        <li className="nav-item">
            <Link to={ROUTES.LOGIN} className="nav-link">Login</Link>
        </li>
        <li className="nav-item">
            <Link to={ROUTES.LANDING} className="nav-link">Landing</Link>
        </li>
        <li className="nav-item">
            <Link to={ROUTES.HOME} className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
            <Link to={ROUTES.ACCOUNT} className="nav-link">Account</Link>
        </li>
        <li className="nav-item">
            <Link to={ROUTES.ADMIN} className="nav-link">Admin</Link>
        </li>
        <li className="nav-item">
            <SignOutButton />
        </li>
    </ul>
);

const NavigationNonAuth = () => (
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
