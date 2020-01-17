import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { compose } from 'recompose';
import queryString from 'query-string';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

export class NoteList extends Component {
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
                this.setState({ notes: tempList, filteredNotes: tempList, loading: false });
            } else {
                this.setState({ dictionary: null, loading: false });
            }

        });


        // this.props.firebase.user(this.props.authUser.uid)
        //     .once('value')
        //     .then(snapshot => {
        //         const dbUser = snapshot.val();

        //     });

        if (query.b) {
            this.props.firebase.notebook(query.b).on('value', snapshot => {
                const notebookObject = snapshot.val();

                if (notebookObject) {
                    // convert notebook from snapshot
                    const tempList = Object.keys(notebookObject).map(key => ({
                        ...notebookObject[key],
                        uid: key,
                    }));
                    this.setState({ notebook: notebookObject, filteredNotebook: tempList, loading: false });
                } else {
                    this.setState({ notebook: null, loading: false });
                }
            });
        }

    }

    componentWillUnmount() {
        this.props.firebase.notebook().off();
        this.props.firebase.dictionary().off();

    }

    render() {
        const { notebook, notes, filteredNotes } = this.state;
        return (
            <React.Fragment>
                <h2>{notebook.title ? notebook.title : 'All Notes'}</h2>
                <div className="list-group">
                    {
                        notes ?
                            notes.map(note => (
                                <Note key={note.uid} note={note} authUser={this.props.authUser} />
                            ))
                            :
                            <div>There are no notes...</div>
                    }
                </div>
            </React.Fragment>
        )
    }
}

const Note = ({ note, authUser }) => {
    const editedAt = new Date(note.editedAt);
    const diff = (Date.now() - editedAt) / 1000;
    let updatedTime = '';
    if (diff < 60) {
        updatedTime = "<1 min"
    } else if (diff < 3600) {
        const min = diff / 60;
        updatedTime = min + " mins";
    } else if (diff < 7200) {
        updatedTime = "1 hr"
    }
    else if (diff < 86400) {
        const hour = Math.floor(diff / 3600);
        updatedTime = hour + " hrs";
    } else if (diff < (2 * 86400)) {
        updatedTime = "1 day"
    } else {
        const day = diff / 86400;
        updatedTime = day + " days";
    }
    // const date = Date.now - tempdate;
    return (
        <Link to={{ pathname: `${ROUTES.NOTEBOOK}/${note.uid}`, state: { note }, }} className="list-group-item list-group-item-action flex-column align-items-start rounded-0 border-right-0 border-left-0">
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{note.title}</h5>
                <small>{updatedTime} ago</small>
            </div>
            <p className="mb-1">Text</p>
        </Link>
    );




    // <div className="card mx-auto my-2" style={{ width: "18rem" }}>
    //     <div className="card-body">
    //         <div className="d-flex">
    //             <Link to={{ pathname: `${ROUTES.DICTIONARY}/${item.uid}`, state: { item }, }} className="text-decoration-none">
    //                 <h5 className="card-title text-dark">{item.title}</h5>
    //             </Link>
    //         </div>
    //         <h6 className="card-subtitle mb-2 text-muted">Test</h6>
    //         <p className="card-text">{item.desc}</p>
    //     </div>
    // </div >;
};

export default compose(
    withRouter,
    withFirebase,
)(NoteList)
