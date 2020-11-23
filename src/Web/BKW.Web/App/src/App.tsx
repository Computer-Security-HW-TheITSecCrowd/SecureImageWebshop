import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AuthState from './context/auth/AuthState';
import WebshopState from './context/webshop/WebshopState';
import Login from './components/auth/Login';

import { loginRoute } from './constants/routeConstants';

function App() {
  return (
    <AuthState>
      <WebshopState>
        <Switch>
          <Route path={loginRoute} component={Login} />
          <h1>
            Secure Image Webshop
          </h1>
        </Switch>
      </WebshopState>
    </AuthState>
  );
}

export default App;
