import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import { ForgotPasswordLink } from '../ForgotPassword';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

export default function Login() {
    return (
        <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card border-0 shadow my-auto w-75 rounded min-width" style={{ maxWidth: "500px", }}>
                <div className="card-body">
                    <h1 className="text-center mb-5">Notepad</h1>
                    <h6 className="text-center" >To continue, login to Notepad</h6>
                    <SignInGoogle />
                    <hr className="my-4" />
                    <SignInForm />
                    <ForgotPasswordLink />
                    <SignUpLink />
                </div>
            </div>
        </div >
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
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={this.onChange}
                        className="form-control"
                        id="email"
                        placeholder="Email Address" />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={this.onChange}
                        className="form-control"
                        id="password"
                        placeholder="Password" />
                </div>
                <div className="text-center">
                    <button type="submit" disabled={isInvalid} className="btn btn-success my-2 rounded">Log in</button>
                    {error && <p className="text-danger">{error.message}</p>}
                </div>
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
                // Create default notebook
                this.props.firebase
                    .notebook(socialAuthUser.user.uid, 'default')
                    .set({
                        owner: socialAuthUser.user.uid,
                        title: 'My Notebook',
                        createdAt: this.props.firebase.serverValue.TIMESTAMP,
                        editedAt: this.props.firebase.serverValue.TIMESTAMP,
                        shared: [],
                        notes: [],
                    });

                // Create a user in your Firebase Realtime Database
                return this.props.firebase
                    .user(socialAuthUser.user.uid)
                    .set({
                        username: socialAuthUser.user.displayName,
                        email: socialAuthUser.user.email,
                        notebooks: { 'default': true }
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
            <div onClick={this.onSubmit} className="btn btn-primary w-100" style={{ backgroundColor: "#4885ed" }}>
                <FontAwesomeIcon icon={faGoogle} size="md" className="cursor-pointer mx-auto" />
                <span className="ml-2">Continue with Google</span>
            </div>
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
