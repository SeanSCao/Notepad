import React, { Component } from 'react';

export class Note extends Component {
    render() {
        return (
            <div>
                asdf
            </div>
        )
    }
}

const NoNote = () => (
    <p>No notes, add a new note.</p>
)

export { NoNote };

export default Note;
