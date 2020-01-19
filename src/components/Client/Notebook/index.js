import React, { Component } from 'react';
import { compose } from 'recompose';
import queryString from 'query-string';

import { withAuthorization, withEmailVerification } from '../../Session';
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
        };
    }
    componentDidMount() {
        this.setState({ loading: true });
        const query = queryString.parse(this.props.location.search);

        this.props.firebase.notes(this.props.authUser.uid).on('value', snapshot => {
            const notesObject = snapshot.val();

            if (notesObject) {
                // convert notes from snapshot
                const tempList = Object.keys(notesObject).map(key => ({
                    ...notesObject[key],
                    uid: key,
                }));
                if (!this.state.note) {
                    if (query.n) {
                        const note = tempList.find(element => element.uid === query.n)
                        this.setState({ note: note });
                    } else {
                        const tempNote = tempList[0];
                        this.setState({ note: tempNote }, () => {
                            this.props.history.push(`${ROUTES.NOTEBOOK}?n=${this.state.note.uid}`);
                        });
                    }
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

    // componentDidUpdate(prevProps) {
    //     if (this.props.location.search !== prevProps.location.search) {
    //         this.props.history.push(`${ROUTES.NOTEBOOK}?n=${this.state.note.uid}`);
    //     }
    // }

    componentWillUnmount() {
        this.props.firebase.notebook().off();
    }

    selectNote = (note) => {
        this.setState({ note });
        this.props.history.push(`${ROUTES.NOTEBOOK}?n=${note.uid}`)
    };

    render() {
        const { notebook, notes } = this.state;
        const { authUser } = this.props;
        return (
            <React.Fragment>
                <div className="col-4 col-lg-3 overflow-auto h-100 m-0 p-0 border-right">
                    <NoteList authUser={authUser} notebook={notebook} notes={notes} selectNote={this.selectNote} />
                </div>
                <div className="col overflow-auto h-100">
                    {this.state.note ? <Note authUser={authUser} note={this.state.note} /> : null}
                </div>
            </React.Fragment>
        )
    }
}

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
)(Notebook);