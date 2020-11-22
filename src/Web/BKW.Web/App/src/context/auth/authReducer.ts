import { User } from '../../types';
import setAuthToken from '../../utils/setAuthToken';

export interface State {
  loading: boolean,
  isAuthenticated: boolean,
  accessToken: string | null,
  error: string | null,
  user: User
};

export type ActionType =
  // General
  | { type: "ERROR"; payload: string }
  // Authentication
  | { type: "LOGIN_SUCCESS"; payload: string }
  | { type: "LOGIN_FAIL"; payload: string }
  | { type: "REGISTRATION_SUCCESS"; payload: string }
  | { type: "REGISTRATION_FAIL"; payload: string }

export default (state: State, action: ActionType): State => {
  switch(action.type) {
    default:
      return {
        ...state
      };
  }
};