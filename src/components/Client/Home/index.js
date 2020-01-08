import React, { Component } from 'react';

import { withAuthorization } from '../../Session';

export class Home extends Component {
    render() {
        return (
            <div>

            </div>
        )
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);