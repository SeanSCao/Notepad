import React, { Component } from 'react';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization, withEmailVerification } from '../../Session';
import { withFirebase } from '../../Firebase';
import AddItem from './addItem';
import { ItemList, Item } from './item';

class Dictionary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            desc: '',
            loading: false,
            dictionary: [],
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
                this.setState({ dictionary: tempList, loading: false });
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

    render() {
        const { title, desc, dictionary, loading } = this.state;
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div className="col overflow-auto h-100 py-4">
                        {loading && <div>Loading ...</div>}
                        {dictionary ?
                            <ItemList
                                items={dictionary}
                                onRemoveItem={this.onRemoveItem}
                                authUser={authUser} />
                            :
                            <div>There are no items...</div>
                        }
                        <AddItem
                            authUser={authUser}
                            title={title}
                            desc={desc}
                            onChange={this.onChange}
                            onCreateItem={this.onCreateItem} />
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