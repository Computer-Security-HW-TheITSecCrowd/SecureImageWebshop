import { createContext } from 'react';
import { State } from './authReducer';
import { initialState } from './AuthState';

const authContext = createContext<State>(initialState);

export default authContext;