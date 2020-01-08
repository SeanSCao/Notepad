import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
const ForgotPassword = () => (
    <div className="container mt-4">
        <h1 className="mb-2">PasswordForget</h1>
        <ForgotPasswordForm />
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
                    <label for="email">Email address</label>
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
        <Link to={ROUTES.FORGOT_PASSWORD}>Forgot Password?</Link>
    </p>
);
export default ForgotPassword;
const ForgotPasswordForm = withFirebase(ForgotPasswordFormBase);
export { ForgotPasswordForm, ForgotPasswordLink };