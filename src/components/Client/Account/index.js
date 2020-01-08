import React from 'react';

import { ForgotPasswordForm } from '../../ForgotPassword';
import PasswordChangeForm from '../PasswordChange';

import { AuthUserContext, withAuthorization } from '../../Session';

const Account = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <div>
                <h1>Account: {authUser.email}</h1>
                <h2>Forgot Password</h2>
                <ForgotPasswordForm />
                <h2>Change Password</h2>
                <PasswordChangeForm />
            </div>
        )}
    </AuthUserContext.Consumer>
)

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);
