import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Navigation from '../Navigation';
import Landing from '../Landing';
import SignUp from '../SignUp';
import Login from '../Login';
import ForgotPassword from '../ForgotPassword';
import Client from '../Client';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';


const App = () => (
    <Router>
        <div>
            <Navigation />
            <Route exact path={ROUTES.LANDING} component={Landing} />
            <Route path={ROUTES.SIGN_UP} component={SignUp} />
            <Route path={ROUTES.LOGIN} component={Login} />
            <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
            <Route path={ROUTES.CLIENT} component={Client} />
        </div>
    </Router>
)

export default withAuthentication(App);
