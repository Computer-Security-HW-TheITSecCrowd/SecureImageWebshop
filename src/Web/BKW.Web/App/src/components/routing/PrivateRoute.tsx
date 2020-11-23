import React, { useContext } from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import { PrivateRouteProps } from '../../types';

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, component, ...rest }: PrivateRouteProps) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user } = authContext;
  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps) => {
        if (!isAuthenticated) {
          return <Redirect to='/login' />;
        } else if (user && roles.indexOf(user.role) > -1 && component) {
          return React.createElement(component, props);
        } else {
        return <Redirect to='/' />
        }
      }}
    />
  );
};

export default PrivateRoute;