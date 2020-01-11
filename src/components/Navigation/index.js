import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

const Navigation = ({ authUser }) => (
    <div>
        <AuthUserContext.Consumer>
            {authUser => authUser ? <React.Fragment ></React.Fragment> : <NavigationNonAuth />}
        </AuthUserContext.Consumer>
    </div>
);

// const NavigationAuth = () => (
//     <React.Fragment ></React.Fragment>
//     // <ul className="nav flex-column">
//     //     <li className="nav-item">
//     //         <Link to={ROUTES.CLIENT} className="nav-link">Notes</Link>
//     //     </li>
//     //     <li className="nav-item">
//     //         <Link to={ROUTES.ACCOUNT} className="nav-link">Account</Link>
//     //     </li>
//     //     <li className="nav-item">
//     //         <SignOutButton />
//     //     </li>
//     // </ul>
// );

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
