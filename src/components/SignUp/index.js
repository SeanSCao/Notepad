import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { SignInGoogle } from '../Login';

function SignUp() {
    return (
        <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card border-0 shadow my-auto w-75 rounded min-width" style={{ maxWidth: "500px", }}>
                <div className="card-body">
                    <h1 className="text-center mb-5">Notepad</h1>
                    <SignInGoogle />
                    <hr className="my-4 hr-or" />
                    <SignUpForm />
                </div>
            </div>
        </div >
    )
}

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    isAdmin: false,
    error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';
const ERROR_MSG_ACCOUNT_EXISTS = `
          An account with this E-Mail address already exists.
          Try to login with this account instead. If you think the
          account is already used from one of the social logins, try
          to sign-in with one of them. Afterward, associate your accounts
          on your personal account page.
        `;

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { username, email, passwordOne, isAdmin } = this.state;
        const roles = {};
        if (isAdmin) {
            roles[ROLES.ADMIN] = ROLES.ADMIN;
        }
        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                // Create default notebook in Firebase database
                this.props.firebase
                    .notebook(authUser.user.uid, 'default')
                    .set({
                        owner: authUser.user.uid,
                        title: 'My Notebook',
                        createdAt: this.props.firebase.serverValue.TIMESTAMP,
                        editedAt: this.props.firebase.serverValue.TIMESTAMP,
                        shared: [],
                        notes: [],
                    });

                // Create a user in Firebase database
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email,
                        roles,
                        notebooks: { 'default': true },
                    });
            })
            .then(() => {
                return this.props.firebase.doSendEmailVerification();
            })
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.CLIENT);
            })
            .catch(error => {
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

                this.setState({ error });
            });
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };
    
    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            terms,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <form onSubmit={this.onSubmit}>
                <h5>Sign up with email</h5>
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={this.onChange}
                        className="form-control"
                        id="name"
                        placeholder="What should we call you?" />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={this.onChange}
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email" />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="passwordOne"
                        value={passwordOne}
                        onChange={this.onChange}
                        className="form-control"
                        id="passwordOne"
                        placeholder="Enter Password" />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="passwordTwo"
                        value={passwordTwo}
                        onChange={this.onChange}
                        className="form-control"
                        id="passwordTwo"
                        placeholder="Confirm Password" />
                </div>
                <div className="text-center">
                    <small className="form-text">By clicking Sign up, you agree to the Terms and Conditions of Use.</small>
                    <button type="submit" disabled={isInvalid} className="btn btn-success my-2 rounded">Sign Up</button>
                    {error && <p className="text-danger">{error.message}</p>}
                    <p>Already have an account? <Link to={ROUTES.LOGIN}>Login</Link></p>
                </div>
            </form>
        )
    }
}

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase
)(SignUpFormBase)

export default SignUp;

export { SignUpForm, SignUpLink };