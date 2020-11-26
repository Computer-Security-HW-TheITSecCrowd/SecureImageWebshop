import { createContext } from 'react';
import { State } from './webshopReducer';

export const initialState: State = {
  animations: [],
  hasMore: true,
  searchText: '',
  loading: false,
  error: null
};

const authContext = createContext<State>(initialState);

export default authContext;