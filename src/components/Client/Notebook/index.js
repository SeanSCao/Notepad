import React, { Component } from 'react';
import { compose } from 'recompose';
import { Route } from 'react-router-dom';


import { AuthUserContext, withAuthorization, withEmailVerification } from '../../Session';
import { withFirebase } from '../../Firebase';

import * as ROUTES from '../../../constants/routes';

const Notebook = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <React.Fragment>
                <div className="col overflow-auto h-100 mt-4">
                    iu
                </div>
                <div>
                    <Route path={ROUTES.NOTEBOOK_NOTE} />
                </div>
            </React.Fragment>
        )}
    </AuthUserContext.Consumer>
)

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
)(Notebook);