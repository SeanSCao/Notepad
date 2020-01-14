import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

const ItemList = ({ items, onRemoveItem, authUser }) => (
    <div className="card-columns">
        {items.map(item => (
            <Item key={item.uid} item={item} onRemoveItem={onRemoveItem} authUser={authUser} />
        ))}
    </div>
);

const Item = ({ item, onRemoveItem, authUser }) => (
    <div className="card" style={{ width: "18rem" }}>
        <div className="d-flex justify-content-end">
            <FontAwesomeIcon icon={faTrashAlt} onClick={() => onRemoveItem(authUser.uid, item.uid)} className="ml-auto" />
        </div>
        <div className="card-body">
            <h5 className="card-title">{item.title}</h5>
            <h6 className="card-subtitle mb-2 text-muted">Test</h6>
            <p className="card-text">{item.desc}</p>
        </div>
    </div >
);

export { ItemList, Item };