import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../../Client/SignOut';
import * as ROUTES from '../../../constants/routes';
// import * as ROLES from '../../../constants/roles';

export default function ClientNavigation(props) {
    return (
        <div className="col-xl-1 col-2 bg-dark">
            <ul className="nav flex-column">
                <li className="nav-item">
                    {props.user.username ?
                        <Link to={ROUTES.ACCOUNT} className="nav-link text-white">{props.user.username}</Link>
                        : <Link to={ROUTES.ACCOUNT} className="nav-link text-white">User</Link>
                    }
                </li>
                <li className="nav-item">
                    <Link to={ROUTES.DICTIONARY} className="nav-link text-white">Dictionary</Link>
                </li>
                <li className="nav-item">
                    <Link to={ROUTES.NOTES} className="nav-link text-white">Notes</Link>
                </li>
                <li className="nav-item">
                    <SignOutButton />
                </li>
            </ul>
        </div>
    )
}

