import React, { Component } from 'react';
import { compose } from 'recompose';
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
            loading: false,
            notebook: [],
            notes: [],
            filter: '',
            filteredNotes: [],
            query: {},
        };
    }
    componentDidMount() {
        this.setState({ loading: true });
        this.setState({ query: queryString.parse(this.props.location.search) });

        this.props.firebase.notes(this.props.authUser.uid).on('value', snapshot => {
            const notesObject = snapshot.val();

            if (notesObject) {
                // convert notes from snapshot
                const tempList = Object.keys(notesObject).map(key => ({
                    ...notesObject[key],
                    uid: key,
                }));
                if (this.state.query.n) {
                    const note = tempList.find(element => element.uid == this.state.query.n)
                    this.setState({ note: note });
                } else {
                    this.setState({ note: tempList[0] });
                }
                this.setState({ notes: tempList, filteredNotes: tempList, loading: false });
            } else {
                this.setState({ notes: null, note: null, loading: false });
            }

        });


        // this.props.firebase.user(this.props.authUser.uid)
        //     .once('value')
        //     .then(snapshot => {
        //         const dbUser = snapshot.val();

        //     });

        // if (query.b) {
        //     this.props.firebase.notebook(query.b).on('value', snapshot => {
        //         const notebookObject = snapshot.val();

        //         if (notebookObject) {
        //             // convert notebook from snapshot
        //             const tempList = Object.keys(notebookObject).map(key => ({
        //                 ...notebookObject[key],
        //                 uid: key,
        //             }));
        //             this.setState({ notebook: notebookObject, filteredNotebook: tempList, loading: false });
        //         } else {
        //             this.setState({ notebook: null, loading: false });
        //         }
        //     });
        // }

    }

    componentWillUnmount() {
        this.props.firebase.notebook().off();
    }

    render() {
        const { notebook, notes, note } = this.state;
        const { authUser } = this.props;
        return (
            <React.Fragment>
                <div className="col-4 col-lg-3 overflow-auto h-100 m-0 p-0 border-right">
                    <NoteList authUser={authUser} notebook={notebook} notes={notes} />
                </div>
                <div className="col overflow-auto h-100">
                    {note ? <Note authUser={authUser} note={note} /> : null}
                </div>
            </React.Fragment>
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