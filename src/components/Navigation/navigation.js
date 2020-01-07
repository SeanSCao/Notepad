import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut/signout';
import * as ROUTES from '../../constants/routes';

export class Navigation extends Component {
    render() {
        return (
            <div>
                <ul>
                    <li>
                        <Link to={ROUTES.LOGIN}>Login</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.LANDING}>Landing</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.HOME}>Home</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.ACCOUNT}>Account</Link>
                    </li>
                    <li>
                        <Link to={ROUTES.ADMIN}>Admin</Link>
                    </li>
                    <li>
                        <SignOutButton />
                    </li>
                </ul>
            </div>
        )
    }
}

export default Navigation
