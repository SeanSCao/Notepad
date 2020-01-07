import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Navigation from '../Navigation';
import Landing from '../Landing';
import SignUp from '../SignUp';
import Login from '../Login';
import ForgotPassword from '../ForgotPassword';
import Home from '../Home';
import Account from '../Account';
import Admin from '../Admin';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
        };
    }

    componentDidMount() {
        this.props.firebase.auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState({ authUser })
                : this.setState({ authUser: null });
        });
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        return (
            <Router>
                <div>
                    <Navigation authUser={this.state.authUser} />
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
}

export default withFirebase(App);
