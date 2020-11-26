import { Animation, AnimationDetails } from '../../types';
import { initialState } from './webshopContext';

export interface State {
  animations: Animation[],
  selectedAnimation?: AnimationDetails | null,
  searchText: string,
  loading: boolean,
  error: string | null,
  getAnimations?: (filter: string) => Promise<void>,
  selectAnimation?: (animation: Animation) => Promise<void>,
  animationSelectionClear?: () => void,
  setSearchText?: (text: string) => void,
  clearWebshopState?: () => void,
  uploadAnimation?: (formData: { title: string, upload: any }) => Promise<void>
};

export type ActionType =
  // General
  | { type: "ERROR"; payload: string }
  | { type: "CLEAR_ERRORS"; }
  | { type: "LOADING"; }
  | { type: "CLEAR_STATE"; }
  // Animations
  | { type: "ANIMATIONS_LOADED"; payload: Animation[] }
  | { type: "ANIMATION_SELECTED"; payload: AnimationDetails }
  | { type: "ANIMATION_SELECTION_CLEAR"; }
  // Search
  | { type: "SEARCH_TEXT_SET"; payload: string }

export default (state: State, action: ActionType): State => {
  switch(action.type) {
    case "ANIMATIONS_LOADED":
      return {
        ...state,
        loading: false,
        animations: action.payload
      };
    case "ANIMATION_SELECTED":
      return {
        ...state,
        selectedAnimation: action.payload
      };
    case "ANIMATION_SELECTION_CLEAR":
      return {
        ...state,
        selectedAnimation: null
      };
    case "SEARCH_TEXT_SET":
      return {
        ...state,
        searchText: action.payload
      };
    case "LOADING":
      return {
        ...state,
        loading: true
      };
    case "CLEAR_STATE":
      return initialState;
    default:
      return {
        ...state
      };
  }
};