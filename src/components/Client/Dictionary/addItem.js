import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../../constants/routes';

export default function AddItem(props) {
    return (
        <form onSubmit={e => props.onCreateItem(e, props.authUser)}>
            <div className="form-group">
                <label for="title">Title</label>
                <input
                    type="text"
                    name="title"
                    value={props.title}
                    onChange={props.onChange}
                    className="form-control"
                    id="title"
                    placeholder="Enter Title" />
            </div>
            <div className="form-group">
                <label for="desc">Description</label>
                <input
                    type="text"
                    name="desc"
                    value={props.desc}
                    onChange={props.onChange}
                    className="form-control"
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
