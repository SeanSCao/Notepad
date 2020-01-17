import React, { Component } from 'react';
import { compose } from 'recompose';
import { Route } from 'react-router-dom';
import queryString from 'query-string';


import { AuthUserContext, withAuthorization, withEmailVerification } from '../../Session';
import { withFirebase } from '../../Firebase';
import NoteList from './noteList';
import Note from './note';

import * as ROUTES from '../../../constants/routes';

class Notebook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: {},
        };
    }
    componentDidMount() {
    }

    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <React.Fragment>
                        <div className="col overflow-auto h-100 m-0 p-0 border-right">
                            <NoteList authUser={authUser} />
                        </div>
                        <div className="col overflow-auto h-100">
                            <Note authUser={authUser} />
                        </div>
                    </React.Fragment>
                )}
            </AuthUserContext.Consumer>
        )
    }
}


// const Notebook = () => (
//     <AuthUserContext.Consumer>
//         {authUser => (
//             <React.Fragment>
//                 <div className="col overflow-auto h-100">
//                     <NoteList authUser={authUser} />
//                 </div>
//                 <div className="col overflow-auto h-100">
//                     <Note authUser={authUser} />
//                 </div>
//             </React.Fragment>
//         )}
//     </AuthUserContext.Consumer>
// )

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
)(Notebook);