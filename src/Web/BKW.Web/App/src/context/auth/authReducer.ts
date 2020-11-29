import { LoginCredentials, RegistrationCredentials, User } from '../../types';
import setAuthToken from '../../utils/setAuthToken';
import { initialState } from './authContext';

export interface State {
  loading: boolean,
  isAuthenticated: boolean,
  error: string | null,
  user: User,
  login?: (formData: LoginCredentials) => Promise<void>,
  logout?: () => Promise<void>,
  register?: (formData: RegistrationCredentials) => Promise<void>,
};

export type ActionType =
  // General
  | { type: "ERROR"; payload: string }
  | { type: "CLEAR_ERRORS" }
  | { type: "LOADING"; }
  // Authentication
  | { type: "LOGIN_SUCCESS"; payload: { jwt: string, user: User }}
  | { type: "LOGOUT" }
  | { type: "REGISTRATION_SUCCESS"; }

export default (state: State, action: ActionType): State => {
  switch(action.type) {

    case "LOGIN_SUCCESS":
      setAuthToken(action.payload.jwt);
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isAuthenticated: true
      };
    case "REGISTRATION_SUCCESS":
      return {
        ...state,
        loading: false
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
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null
      };
    case "LOGOUT":
      return initialState;
    default:
      return {
        ...state
      };
  }
};