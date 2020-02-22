import React from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

const EditProfile = (props) => (
    <div className="col px-4 pt-2 overflow-hidden border-right bg-light" style={{ maxWidth: "750px", }}>
        <h2>Profile</h2>
        <hr />
        <div className="row mt-5">
            <div className="col">
                <p className="m-0 font-weight-bold">Name</p>
            </div>
            <div className="col">{props.authUser.username}</div>
        </div>
        <hr />
        <div className="row">
            <div className="col">
                <p className="m-0 font-weight-bold">Email</p>
            </div>
            <div className="col">{props.authUser.email}</div>
        </div>
        <hr />
        <Link to={ROUTES.ACCOUNT} className="btn btn-outline-secondary">Cancel</Link>
        {/* <PasswordChangeForm /> */}
        {/* <LoginManagement authUser={authUser} /> */}
    </div>
)

export default EditProfile;