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
        const query = queryString.parse(this.props.location.search);
        this.setState({ query: { b: query.b, n: query.n } });
    }
    render() {
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <React.Fragment>
                        <div className="col overflow-auto h-100">
                            <NoteList authUser={authUser} query={this.state.query} />
                        </div>
                        <div className="col overflow-auto h-100">
                            <Note authUser={authUser} query={this.state.query} />
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