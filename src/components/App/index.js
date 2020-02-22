import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import Webpage from '../Webpage';
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
            <Switch>
                <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
                <Route exact path={ROUTES.LOGIN} component={Login} />
                <Route exact path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
                <Route path={ROUTES.CLIENT} component={Client} />
                <Route path={ROUTES.LANDING} component={Webpage} />
            </Switch>

        </div>
    </Router>
)

export default withAuthentication(App);
