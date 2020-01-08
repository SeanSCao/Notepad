import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes';

function SignUp() {
    return (
        <div className="container mt-4">
            <h1 className="mb-2">Sign Up</h1>
            <SignUpForm />
        </div>
    )
}

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { username, email, passwordOne } = this.state;
        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.CLIENT);
            })
            .catch(error => {
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
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label for="name">Full Name</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={this.onChange}
                        className="form-control"
                        id="name"
                        placeholder="Enter name" />
                </div>
                <div className="form-group">
                    <label for="email">Email address</label>
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
                    <label for="passwordOne">Password</label>
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
                    <label for="passwordTwo">Confirm Password</label>
                    <input
                        type="password"
                        name="passwordTwo"
                        value={passwordTwo}
                        onChange={this.onChange}
                        className="form-control"
                        id="passwordTwo"
                        placeholder="Enter Password Again" />
                </div>
                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="check" />
                    <label className="form-check-label" for="check">I agree to the terms and conditions</label>
                </div>
                <button type="submit" disabled={isInvalid} className="btn btn-primary">Sign Up</button>
                {error && <p>{error.message}</p>}
            </form>
        )
    }
}

const SignUpLink = () => (
    <p>
        Don't have an account?
        <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase
)(SignUpFormBase)

export default SignUp;

export { SignUpForm, SignUpLink };