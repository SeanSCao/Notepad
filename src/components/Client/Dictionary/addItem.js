import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';

import * as ROUTES from '../../../constants/routes';

class AddItemBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            desc: '',
        };
    }

    onCreateItem = (e, authUser) => {
        e.preventDefault();
        this.props.firebase.dictionary(authUser.uid).push({
            title: this.state.title,
            desc: this.state.desc,
            userId: authUser.uid,
        }, () => {
            this.props.history.push(ROUTES.DICTIONARY);
        });

        this.setState({ title: '', desc: '' });
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <form onSubmit={e => this.onCreateItem(e, this.props.authUser)} className="container">
                <div className="form-group">
                    <label for="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={this.state.title}
                        onChange={this.onChange}
                        className="form-control"
                        id="title"
                        placeholder="Enter Title" />
                </div>
                <div className="form-group">
                    <label for="desc">Description</label>
                    <textarea
                        type="text"
                        name="desc"
                        value={this.state.desc}
                        onChange={this.onChange}
                        className="form-control"
                        rows="5"
                        id="desc"
                        placeholder="Add Description" />
                </div>
                <Link to={ROUTES.DICTIONARY} className="text-white">
                    <button className="btn btn-dark mr-2">Cancel</button>
                </Link>
                <button type="submit" className="btn btn-dark">Add</button>
            </form>
        )
    }
}

const AddItem = compose(
    withRouter,
    withFirebase
)(AddItemBase);

export default AddItem;