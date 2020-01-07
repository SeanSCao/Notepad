import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp/signup';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

export default function Login() {
    return (
        <div>
            <h1>Login</h1>
            <SignInForm />
            <SignUpLink />
        </div>
    )
}

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};


export class LoginFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        this.props.firebase.doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        const { email, password, error } = this.state;
        const isInvalid = password === '' || email === '';
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <button disabled={isInvalid} type="submit">
                    Sign In
            </button>
                {error && <p>{error.message}</p>}
            </form>
        )
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase
)(LoginFormBase);
