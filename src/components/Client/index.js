import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ClientNavigation from './ClientNavigation';
import Dictionary from './Dictionary';
import Account from './Account';
import EditProfile from './EditProfile';
import Admin from './Admin';
import Notebook from './Notebook';

import * as ROUTES from '../../constants/routes';

import { AuthUserContext, withAuthorization } from '../Session';

function Client() {
    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div className="row vh-100">
                    <ClientNavigation authUser={authUser}></ClientNavigation>
                    <Switch>
                        <Route path={ROUTES.DICTIONARY} component={Dictionary} />
                        <Route path={ROUTES.ACCOUNT} component={Account} />
                        <Route path={ROUTES.EDIT_PROFILE} render={() => <EditProfile authUser={authUser} />} />
                        <Route path={ROUTES.NOTEBOOK} render={() => <Notebook authUser={authUser} />} />
                        <Route path={ROUTES.ADMIN} component={Admin} />
                    </Switch>
                </div>
            )}
        </AuthUserContext.Consumer>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Client);
