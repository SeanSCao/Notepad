import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../../constants/routes';
import { withFirebase } from '../../Firebase';

const SignOutButton = ({ firebase }) => (
    <Link to={ROUTES.LANDING} className="nav-link text-white" onClick={firebase.doSignOut}>Sign Out</Link>
);

export default withFirebase(SignOutButton);
