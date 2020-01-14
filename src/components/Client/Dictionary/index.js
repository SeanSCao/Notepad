import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';


import { AuthUserContext, withAuthorization, withEmailVerification } from '../../Session';
import { withFirebase } from '../../Firebase';
import AddItem from './addItem';
import { ItemList, Item } from './item';

import * as ROUTES from '../../../constants/routes';


class Dictionary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            desc: '',
            loading: false,
            dictionary: [],
            filter: '',
            filteredDictionary: [],
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.props.firebase.dictionary(this.props.authUser.uid).on('value', snapshot => {
            const dictionaryObject = snapshot.val();

            if (dictionaryObject) {
                // convert dictionary from snapshot
                const tempList = Object.keys(dictionaryObject).map(key => ({
                    ...dictionaryObject[key],
                    uid: key,
                }));
                this.setState({ dictionary: tempList, filteredDictionary: tempList, loading: false });
            } else {
                this.setState({ dictionary: null, loading: false });
            }

        });
    }

    componentWillUnmount() {
        this.props.firebase.dictionary().off();
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onCreateItem = (e, authUser) => {
        e.preventDefault();
        this.props.firebase.dictionary(authUser.uid).push({
            title: this.state.title,
            desc: this.state.desc,
            userId: authUser.uid,
        });
        this.setState({ title: '', desc: '' });
    };

    onRemoveItem = (authuid, uid) => {
        this.props.firebase.dictionaryItem(authuid, uid).remove();
    };

    filterDictionary = e => {
        this.setState({ filter: e.target.value });
        if (e.target.value === '') {
            this.setState({ filteredDictionary: this.state.dictionary });
        } else {
            const PATTERN = this.state.filter.toLowerCase();
            const filtered = this.state.dictionary.filter(function (item) { return item.title.toLowerCase().includes(PATTERN) || item.desc.toLowerCase().includes(PATTERN) });
            this.setState({ filteredDictionary: filtered });
        }
    }

    render() {
        const { title, desc, dictionary, filteredDictionary, loading } = this.state;
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div className="col overflow-auto h-100 py-4">
                        {loading && <div>Loading ...</div>}
                        <Switch>
                            <Route exact path={ROUTES.DICTIONARY} render={() => <div>
                                <div className="container my-4">
                                    <div className="form-group mx-auto w-50 d-flex">
                                        <Link to={ROUTES.DICTIONARY_NEW} className="text-white">
                                            <button className="btn btn-dark mr-2">Add</button>
                                        </Link>
                                        <input className="form-control" value={this.state.filter} onChange={this.filterDictionary} placeholder="Search" />
                                    </div>
                                </div>
                                {
                                    dictionary ?
                                        <ItemList
                                            items={filteredDictionary}
                                            onRemoveItem={this.onRemoveItem}
                                            authUser={authUser} />
                                        :
                                        <div>There are no items...</div>
                                }
                            </div>
                            } />
                            <Route path={ROUTES.DICTIONARY_NEW} render={() => <AddItem
                                authUser={authUser}
                                title={title}
                                desc={desc}
                                onChange={this.onChange}
                                onCreateItem={this.onCreateItem} />} />
                        </Switch>
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
)(Dictionary);