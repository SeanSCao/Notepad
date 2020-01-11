import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

export class Landing extends Component {
    render() {
        return (
            <div className="">
                <div class="jumbotron">
                    <div class="container">
                        <h1 class="display-4">Hello!</h1>
                        <p class="lead">This is a simple notepad app that allows you to create a database of elements to mention within throughout your quest planning.</p>

                        <p>Organise your quests, find and share information faster.</p>
                        <p class="lead">
                            <Link to={ROUTES.SIGN_UP} class="btn btn-primary btn-lg" role="button">Sign Up For Free</Link>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Landing
