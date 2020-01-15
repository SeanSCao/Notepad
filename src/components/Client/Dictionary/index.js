import React, { Component } from 'react';
import { withRouter, Link, Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


import { AuthUserContext, withAuthorization, withEmailVerification } from '../../Session';
import { withFirebase } from '../../Firebase';
import AddItem from './addItem';
import { ItemList } from './itemList';

import * as ROUTES from '../../../constants/routes';

const Dictionary = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <div className="col overflow-auto h-100 mt-4">
                <Switch>
                    <Route exact path={ROUTES.DICTIONARY} render={() => <DictionaryList authUser={authUser} />} />
                    <Route exact path={ROUTES.DICTIONARY_DETAILS} render={(matchProps) => <DictionaryItem {...matchProps} authUser={authUser} />} />
                    <Route exact path={ROUTES.DICTIONARY_NEW} render={() => <AddItem authUser={authUser} />} />
                </Switch>
            </div>
        )}
    </AuthUserContext.Consumer>
)

class DictionaryListBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        const { dictionary, filteredDictionary, loading } = this.state;
        return (
            <React.Fragment>
                <div className="form-group mx-auto w-50 d-flex">
                    <Link to={ROUTES.DICTIONARY_NEW} className="text-white">
                        <button className="btn btn-dark mr-2">Add</button>
                    </Link>
                    <input className="form-control" value={this.state.filter} onChange={this.filterDictionary} placeholder="Search" />
                </div>
                {loading && <div className="d-flex h-100 justify-content-center align-items-center"><FontAwesomeIcon icon={faSpinner} spin size="6x" /></div>
                }
                {
                    dictionary ?
                        <ItemList
                            items={filteredDictionary}
                            onRemoveItem={this.onRemoveItem}
                            authUser={this.props.authUser} />
                        :
                        <div>There are no items...</div>
                }
            </React.Fragment>
        );
    }
}

class DictionaryItemBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            item: {},
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.props.firebase.dictionaryItem(this.props.authUser.uid, this.props.match.params.id)
            .on('value', snapshot => {
                this.setState({
                    item: snapshot.val(),
                    loading: false,
                });
            });
    }

    render() {
        return (
            <div>
                <Link to={ROUTES.DICTIONARY} className="text-dark">Back</Link>
                <div className="card mx-auto w-75">
                    <div className="card-body">
                        <div className="d-flex">
                            <h5 className="card-title text-dark">{this.state.item.title}</h5>
                            {/* <FontAwesomeIcon icon={faTrashAlt} onClick={() => onRemoveItem(this.props.authUser.uid, this.state.item.uid)} className="ml-auto" /> */}
                        </div>
                        <h6 className="card-subtitle mb-2 text-muted">Test</h6>
                        <p className="card-text">{this.state.item.desc}</p>
                    </div>
                </div >
            </div>

        )
    }
}

const DictionaryList = compose(
    withRouter,
    withFirebase
)(DictionaryListBase)

const DictionaryItem = compose(
    withFirebase
)(DictionaryItemBase);

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
)(Dictionary);