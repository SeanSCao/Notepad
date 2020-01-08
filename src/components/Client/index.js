import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import ClientNavigation from './ClientNavigation';
import Home from './Home';
import Account from './Account';
import Admin from './Admin';

import * as ROUTES from '../../constants/routes';

import { AuthUserContext, withAuthorization } from '../Session';

function Client() {
    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <ClientNavigation></ClientNavigation>
                    <Route path={ROUTES.ACCOUNT} component={Account} />
                    <Route path={ROUTES.ADMIN} component={Admin} />
                </div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Client);
