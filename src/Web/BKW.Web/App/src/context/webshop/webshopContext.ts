import { createContext } from 'react';
import { State } from './webshopReducer';

export const initialState: State = {
  loading: false,
  error: null
};

const authContext = createContext<State>(initialState);

export default authContext;