import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../../Client/SignOut';
import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';

export default function ClientNavigation() {
    return (
        <ul className="nav flex-column">
            <li className="nav-item">
                <Link to={ROUTES.CLIENT} className="nav-link">Notes</Link>
            </li>
            <li className="nav-item">
                <Link to={ROUTES.ACCOUNT} className="nav-link">Account</Link>
            </li>
            <li className="nav-item">
                <SignOutButton />
            </li>
        </ul>
    )
}

