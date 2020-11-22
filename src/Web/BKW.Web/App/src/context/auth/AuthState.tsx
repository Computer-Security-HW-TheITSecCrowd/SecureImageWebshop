import React, { ReactNode, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import AuthContext from './authContext';
import authReducer, { State, ActionType } from './authReducer';
import { initialState } from './authContext';

const AuthState: React.FC<ReactNode> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider
      value={{
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        user: null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;