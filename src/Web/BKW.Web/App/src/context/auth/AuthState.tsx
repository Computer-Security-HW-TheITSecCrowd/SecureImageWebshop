import React, { ReactNode, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import AuthContext from './authContext';
import authReducer from './authReducer';
import { initialState } from './authContext';
import { InteractionError, LoginCredentials, RegistrationCredentials, User } from '../../types';
import { loginEndpoint, logoutEndpoint, registrationEndpoint } from '../../constants/apiConstants';

import openNotification from '../../utils/notification';
import { loginRoute } from '../../constants/routeConstants';

const AuthState: React.FC<ReactNode> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const history = useHistory();

  const checkTokenInLocalStorage = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const user = jwt_decode(token) as User;
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: user, jwt: token },
      });
    }
  };

  const setLoading = () => {
    dispatch({ type: "LOADING" });
  };

  const clearErrors = () => {
    dispatch({ type: "CLEAR_ERRORS" });
  };

  const handleError = (err: InteractionError) => {
    if (err.response) {
      dispatch({
        type: "ERROR",
        payload: err.response.data.msg,
      });
      openNotification('error', err.response.data.msg);
    } else {
      dispatch({
        type: "ERROR",
        payload: err.message,
      });
      openNotification('error', err.message);
    }
  };

  const register = async (formData: RegistrationCredentials) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      setLoading();
      await axios.post(registrationEndpoint, formData, config);

      dispatch({
        type: "REGISTRATION_SUCCESS"
      });
      openNotification('success', 'Successful registration');
      clearErrors();
      history.push(loginRoute);

    } catch (err) {
      handleError(err);
    }
  };

  const login = async (formData: LoginCredentials) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      setLoading();
      const res = await axios.post(loginEndpoint, formData, config);

      const encoded_jwt = res.data.token;
      const user = jwt_decode(encoded_jwt) as User;

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: user, jwt: encoded_jwt },
      });
      clearErrors();

    } catch (err) {
      handleError(err);
    }
  };

  const logout = async () => {
    try {
      // Dispatch first: we should clear browser data even if the request fails.
      dispatch({ type: "LOGOUT" });
      await axios.post(logoutEndpoint);
      history.push(loginRoute);
      clearErrors();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        user: state.user,
        login,
        logout,
        register,
        checkTokenInLocalStorage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;