import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import HomePage from './pages/Home';
import SignupPage from './pages/SignUp';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/signup">
        <SignupPage />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Routes;