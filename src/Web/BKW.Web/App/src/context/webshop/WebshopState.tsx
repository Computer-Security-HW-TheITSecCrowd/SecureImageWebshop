import React, { ReactNode, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import WebshopContext from './webshopContext';
import webshopReducer, { State, ActionType } from './webshopReducer';
import { initialState } from './webshopContext';

const WebshopState: React.FC<ReactNode> = ({ children }) => {
  const [state, dispatch] = useReducer(webshopReducer, initialState);

  return (
    <WebshopContext.Provider
      value={{
        loading: state.loading,
        error: state.error,
      }}
    >
      {children}
    </WebshopContext.Provider>
  );
};

export default WebshopState;