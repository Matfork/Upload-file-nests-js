import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainPage from './pages/Main';

export class Routes extends React.PureComponent {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={MainPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Routes;
