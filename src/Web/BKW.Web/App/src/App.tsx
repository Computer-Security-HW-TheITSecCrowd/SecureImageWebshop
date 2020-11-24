import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AuthState from './context/auth/AuthState';
import WebshopState from './context/webshop/WebshopState';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import MainPage from './components/commonPages/MainPage';
import Upload from './components/customerPages/Upload';
import Gallery from './components/customerPages/Gallery';
import Animations from './components/customerPages/Animations';
import AnimationDetails from './components/commonPages/AnimationDetails';
import LoginRedirect from './components/auth/LoginRedirect';

import { adminRoute, animationDetailsRoute, animationsRoute, galleryRoute, loginRoute, registerRoute, uploadRoute } from './constants/routeConstants';
import { ADMIN, CUSTOMER } from './constants/roleConstants';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <AuthState>
      <WebshopState>
        <Switch>
          <Route path={loginRoute} component={Login} />
          <Route path={registerRoute} component={Register} />
          <PrivateRoute path={adminRoute} roles={[ADMIN]} component={MainPage} />
          <PrivateRoute path={uploadRoute} roles={[CUSTOMER]} component={Upload} />
          <PrivateRoute path={galleryRoute} roles={[CUSTOMER]} component={Gallery} />
          <PrivateRoute path={animationsRoute} roles={[CUSTOMER]} component={Animations} />
          <PrivateRoute path={animationDetailsRoute} roles={[ADMIN, CUSTOMER]} component={AnimationDetails} />
          <Route path='/' component={LoginRedirect} />
        </Switch>
      </WebshopState>
    </AuthState>
  );
}

export default App;
