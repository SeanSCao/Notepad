import React, { Component } from 'react';
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
            filter: '',
            filteredNotebook: [],
        };
    }
    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.user(this.props.authUser.uid)
            .once('value')
            .then(snapshot => {
                const dbUser = snapshot.val();

            });

        if (this.props.query.b) {
            this.props.firebase.notebook(this.props.authUser.uid).on('value', snapshot => {
                const notebookObject = snapshot.val();

                if (notebookObject) {
                    // convert notebook from snapshot
                    const tempList = Object.keys(notebookObject).map(key => ({
                        ...notebookObject[key],
                        uid: key,
                    }));
                    this.setState({ notebook: tempList, filteredNotebook: tempList, loading: false });
                } else {
                    this.setState({ notebook: null, loading: false });
                }

            });
        }

    }

    componentWillUnmount() {
        this.props.firebase.notebook().off();
    }

    render() {
        return (
            <div>
                asf
            </div>
        )
    }
}

export default withFirebase(NoteList)
