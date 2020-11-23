import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';

import AuthState from './context/auth/AuthState';
import WebshopState from './context/webshop/WebshopState';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminMain from './components/adminPages/AdminMain';
import Upload from './components/customerPages/Upload';
import Gallery from './components/customerPages/Gallery';
import Animations from './components/customerPages/Animations';

import { adminRoute, animationsRoute, galleryRoute, loginRoute, registerRoute, uploadRoute } from './constants/routeConstants';
import { ADMIN, CUSTOMER } from './constants/roleConstants';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <AuthState>
      <WebshopState>
        <Switch>
          <Route path={loginRoute} component={Login} />
          <Route path={registerRoute} component={Register} />
          <PrivateRoute path={adminRoute} roles={[ADMIN]} component={AdminMain} />
          <PrivateRoute path={uploadRoute} roles={[CUSTOMER]} component={Upload} />
          <PrivateRoute path={galleryRoute} roles={[CUSTOMER]} component={Gallery} />
          <PrivateRoute path={animationsRoute} roles={[CUSTOMER]} component={Animations} />
        </Switch>
      </WebshopState>
    </AuthState>
  );
}

export default App;
