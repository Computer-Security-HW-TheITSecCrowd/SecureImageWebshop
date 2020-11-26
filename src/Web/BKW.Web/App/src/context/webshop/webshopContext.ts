import { createContext } from 'react';
import { State } from './webshopReducer';

export const initialState: State = {
  animations: [],
  hasMore: true,
  ownAnimations: [],
  hasMoreOwn: true,
  comments: [],
  searchText: '',
  gallerySearchText: '',
  loading: false,
  error: null
};

const authContext = createContext<State>(initialState);

export default authContext;