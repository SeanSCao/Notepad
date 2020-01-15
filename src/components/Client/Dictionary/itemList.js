import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import * as ROUTES from '../../../constants/routes';

const ItemList = ({ items, onRemoveItem, authUser }) => (
    <div className="d-flex flex-wrap">
        {items.map(item => (
            <Item key={item.uid} item={item} onRemoveItem={onRemoveItem} authUser={authUser} />
        ))}
    </div>
);

const Item = ({ item, onRemoveItem, authUser }) => {
    if (item.desc.length > 100) {
        item.desc = item.desc.slice(0, 100) + '...';
    }
    return <div className="card mx-auto my-2" style={{ width: "18rem" }}>
        <div className="card-body">
            <div className="d-flex">
                <Link to={{ pathname: `${ROUTES.DICTIONARY}/${item.uid}`, state: { item }, }} className="text-decoration-none">
                    <h5 className="card-title text-dark">{item.title}</h5>
                </Link>
                <FontAwesomeIcon icon={faTrashAlt} onClick={() => onRemoveItem(authUser.uid, item.uid)} className="ml-auto" />
            </div>
            <h6 className="card-subtitle mb-2 text-muted">Test</h6>
            <p className="card-text">{item.desc}</p>
        </div>
    </div >;
};

export { ItemList, Item };