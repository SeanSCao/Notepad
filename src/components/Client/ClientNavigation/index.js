import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';

import SignOutButton from '../../Client/SignOut';
import * as ROUTES from '../../../constants/routes';
import { withFirebase } from '../../Firebase';
// import * as ROLES from '../../../constants/roles';

function ClientNavigation(props) {
    const onCreateNote = (e, authUser) => {
        e.preventDefault();
        props.firebase.notes(authUser.uid).push({
            title: 'Untitled',
            owner: authUser.uid,
            createdAt: props.firebase.serverValue.TIMESTAMP,
            editedAt: props.firebase.serverValue.TIMESTAMP,
        }, () => {
            props.history.push(ROUTES.NOTEBOOK);
        });
    };

    return (
        <div className="col-xl-1 col-2 bg-dark">
            <ul className="nav flex-column">
                <li className="nav-item">
                    {props.authUser.username ?
                        <Link to={ROUTES.ACCOUNT} className="nav-link text-white">{props.authUser.username}</Link>
                        : <Link to={ROUTES.ACCOUNT} className="nav-link text-white">User</Link>
                    }
                </li>
                <li className="nav-item">
                    <a onClick={e => onCreateNote(e, props.authUser)} className="cursor-pointer nav-link text-white">Add Note</a>
                </li>
                <li className="nav-item">
                    <Link to={ROUTES.DICTIONARY} className="nav-link text-white">Dictionary</Link>
                </li>
                <li className="nav-item">
                    <Link to={ROUTES.NOTEBOOK} className="nav-link text-white">Notes</Link>
                </li>
                <li className="nav-item">
                    <SignOutButton />
                </li>
            </ul>
        </div>
    )
}

export default compose(
    withRouter,
    withFirebase,
)(ClientNavigation);

