import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { compose } from 'recompose';

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

    render() {
        const { notebook, notes, authUser, selectNote } = this.props;
        return (
            <React.Fragment>
                <h2 className="mt-2 ml-2">{notebook.title ? notebook.title : 'All Notes'}</h2>
                <div className="list-group">
                    {
                        notes ?
                            notes.map(note => (
                                <Note key={note.uid} note={note} authUser={authUser} selectNote={selectNote} />
                            ))
                            :
                            <div>There are no notes...</div>
                    }
                </div>
            </React.Fragment>
        )
    }
}

const NoteBase = ({ note, authUser, selectNote }) => {
    const editedAt = new Date(note.editedAt);
    const diff = (Date.now() - editedAt) / 1000;
    let updatedTime = '';
    if (diff < 60) {
        updatedTime = "<1 min"
    } else if (diff < 120) {
        updatedTime = "1 min"
    } else if (diff < 3600) {
        const min = Math.floor(diff / 60);
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
        const day = Math.floor(diff / 86400);
        updatedTime = day + " days";
    }
    let title = note.title;
    if (note.title.length > 15) {
        title = note.title.slice(0, 15) + '...';
    }
    return (
        <Link to={`${ROUTES.NOTEBOOK}?n=${note.uid}`}
            onClick={() => selectNote(note)}
            className="list-group-item list-group-item-action flex-column align-items-start rounded-0 border-right-0 border-left-0">
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{title}</h5>
                <small>{updatedTime} ago</small>
            </div>
            <pre><p className="mb-1">{note.preview ? note.preview : ' '}</p></pre>
        </Link>
    );
};

const Note = withRouter(NoteBase);

export default compose(
    withRouter,
    withFirebase,
)(NoteList)
