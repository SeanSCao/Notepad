import React from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Navigation from '../Navigation/navigation';
import Landing from '../Landing/landing';
import SignUp from '../SignUp/signup';
import Login from '../Login/login';
import ForgotPassword from '../ForgotPassword/forgotPassword';
import Home from '../Home/home';
import Account from '../Account/account';
import Admin from '../Admin/admin';
import * as ROUTES from '../../constants/routes';

export default function app() {
    return (
        <Router>
            <div>
                <Navigation />
                <Route exact path={ROUTES.LANDING} component={Landing} />
                <Route path={ROUTES.SIGN_UP} component={SignUp} />
                <Route path={ROUTES.LOGIN} component={Login} />
                <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
                <Route path={ROUTES.HOME} component={Home} />
                <Route path={ROUTES.ACCOUNT} component={Account} />
                <Route path={ROUTES.ADMIN} component={Admin} />
            </div>
        </Router>
    )
}
