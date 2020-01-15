import React from 'react';
import { Route } from 'react-router-dom';

import ClientNavigation from './ClientNavigation';
import Dictionary from './Dictionary';
import Account from './Account';
import Admin from './Admin';

import * as ROUTES from '../../constants/routes';

import { AuthUserContext, withAuthorization } from '../Session';

function Client() {
    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div className="row vh-100">
                    <ClientNavigation user={authUser}></ClientNavigation>
                    <Route path={ROUTES.DICTIONARY} component={Dictionary} />
                    <Route path={ROUTES.ACCOUNT} component={Account} />
                    <Route path={ROUTES.ADMIN} component={Admin} />
                </div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Client);
