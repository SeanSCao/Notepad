import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const ForgotPassword = () => (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card border-0 shadow my-auto w-auto w-m-50 rounded">
            <div className="card-body">
                <h1 className="text-center mb-5">Notepad</h1>
                <h5 className="card-title">Forgot your password?</h5>
                <p className="m-0">To reset your password, please enter your email address.</p>
                <p>We will send instructions for resetting your password to your email.</p>
                <ForgotPasswordForm />
            </div>
        </div>
    </div>
);
const INITIAL_STATE = {
    email: '',
    error: null,
};
class ForgotPasswordFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    onSubmit = event => {
        const { email } = this.state;
        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    };
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        const { email, error } = this.state;
        const isInvalid = email === '';
        return (
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="email"
                        value={this.state.email}
                        onChange={this.onChange}
                        className="form-control"
                        id="email"
                        placeholder="Email Address" />
                </div>
                <button disabled={isInvalid} className="btn btn-primary" type="submit">
                    Reset My Password
                </button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}
const ForgotPasswordLink = () => (
    <p>
        <Link to={ROUTES.FORGOT_PASSWORD}>Forgot your password?</Link>
    </p>
);
export default ForgotPassword;
const ForgotPasswordForm = withFirebase(ForgotPasswordFormBase);
export { ForgotPasswordForm, ForgotPasswordLink };