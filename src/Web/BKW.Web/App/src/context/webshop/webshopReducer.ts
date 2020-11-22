export interface State {
  loading: boolean,
  error: string | null
};

export type ActionType =
  // General
  | { type: "ERROR"; payload: string }

export default (state: State, action: ActionType): State => {
  switch(action.type) {
    default:
      return {
        ...state
      };
  }
};