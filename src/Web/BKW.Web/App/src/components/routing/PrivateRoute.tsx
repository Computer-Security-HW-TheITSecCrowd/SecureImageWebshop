import React, { Component, useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import { PrivateRouteProps } from '../../types';

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component, roles, path }: PrivateRouteProps) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user } = authContext;
  return (
    <Route
      path={path}
      render={props =>
        !isAuthenticated ? (
          <Redirect to='/login' />
        ) : (user && roles.indexOf(user.role) > -1 ?
          <Component {...props} />
          : <Redirect to='/' />
          )
      }
    />
  );
};

export default PrivateRoute;