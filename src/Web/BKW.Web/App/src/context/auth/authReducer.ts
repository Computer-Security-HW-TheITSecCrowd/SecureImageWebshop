import { LoginCredentials, User } from '../../types';
import setAuthToken from '../../utils/setAuthToken';
import { initialState } from './authContext';

export interface State {
  loading: boolean,
  isAuthenticated: boolean,
  accessToken: string | null,
  error: string | null,
  user: User,
  login?: (formData: LoginCredentials) => Promise<void>,
  logout?: () => Promise<void>,
  checkTokenInLocalStorage?: () => Promise<void>
};

export type ActionType =
  // General
  | { type: "ERROR"; payload: string }
  // Authentication
  | { type: "LOGIN_SUCCESS"; payload: { jwt: string, user: User }}
  | { type: "LOGIN_FAIL"; payload: string }
  | { type: "LOGOUT" }
  | { type: "REGISTRATION_SUCCESS"; payload: string }
  | { type: "REGISTRATION_FAIL"; payload: string }
  | { type: "LOADING"; }

export default (state: State, action: ActionType): State => {
  switch(action.type) {

    case "LOGIN_SUCCESS":
      localStorage.setItem('accessToken', action.payload.jwt);
      setAuthToken(action.payload.jwt);
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isAuthenticated: true
      };
    case "LOADING":
      return {
        ...state,
        loading: true
      };
    case "ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case "LOGOUT":
      localStorage.removeItem('accessToken');
      return initialState;
    default:
      return {
        ...state
      };
  }
};