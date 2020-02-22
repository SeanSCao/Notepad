import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Navigation from '../Navigation';
import Landing from '../Landing';

import * as ROUTES from '../../constants/routes';

const Webpage = () => (
    <div>
        <Navigation />
        <Switch>
            <Route exact path={ROUTES.LANDING} component={Landing} />
        </Switch>

    </div>
)

export default Webpage;
