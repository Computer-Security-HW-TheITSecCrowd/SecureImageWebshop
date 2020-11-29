import { createContext } from 'react';
import { State } from './authReducer';

export const initialState: State = {
  loading: false,
  isAuthenticated: false,
  error: null,
  user: null
};

const authContext = createContext<State>(initialState);

export default authContext;