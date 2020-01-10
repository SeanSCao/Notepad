import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { ForgotPasswordLink } from '../ForgotPassword';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

export default function Login() {
    return (
        <div className="container mt-4">
            <h1 className="mb-2">Log In</h1>
            <SignInForm />
            <SignInGoogle />
            <ForgotPasswordLink />
            <SignUpLink />
        </div>
    )
}

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS =
    'auth/account-exists-with-different-credential';
const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;


class LoginFormBase extends Component {
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
                this.props.history.push(ROUTES.CLIENT);
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
                <div className="form-group">
                    <label for="email">Email Address</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={this.onChange}
                        className="form-control"
                        id="email"
                        placeholder="Enter Email Address" />
                </div>
                <div className="form-group">
                    <label for="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={this.onChange}
                        className="form-control"
                        id="password"
                        placeholder="Enter Password" />
                </div>
                <button type="submit" disabled={isInvalid} className="btn btn-primary">Log In</button>
                {error && <p>{error.message}</p>}
            </form>
        )
    }
}

class SignInGoogleBase extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    onSubmit = e => {
        this.props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                if (!socialAuthUser.additionalUserInfo.isNewUser) {
                    return;
                }

                // Create a user in your Firebase Realtime Database
                return this.props.firebase
                    .user(socialAuthUser.user.uid)
                    .set({
                        username: socialAuthUser.user.displayName,
                        email: socialAuthUser.user.email
                    });
            })
            .then(() => {
                this.setState({ error: null });
                this.props.history.push(ROUTES.CLIENT);
            })
            .catch(error => {
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }
                this.setState({ error });
            });
        e.preventDefault();
    };
    render() {
        const { error } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <button type="submit" className="btn btn-primary">Sign In with Google</button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase
)(LoginFormBase);

const SignInGoogle = compose(
    withRouter,
    withFirebase,
)(SignInGoogleBase);

export { SignInForm, SignInGoogle };
