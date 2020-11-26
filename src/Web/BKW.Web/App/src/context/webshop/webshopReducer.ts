// import { Animation, AnimationDetails } from '../../types';
import { stat } from 'fs';
import AnimationComments from '../../components/commonPages/AnimationComments';
import { Animation, AnimationWithComments, Comment, CommentProps } from '../../types';
import { initialState } from './webshopContext';

export interface State {
  animations: Animation[],
  hasMore: boolean,
  selectedAnimation?: AnimationWithComments | null,
  comments: Comment[],
  searchText: string,
  loading: boolean,
  error: string | null,
  getAnimations?: (filter: string, count?: number, loadingMore?: boolean) => Promise<void>,
  selectAnimation?: (animation: Animation) => Promise<void>,
  animationSelectionClear?: () => void,
  setSearchText?: (text: string) => void,
  clearWebshopState?: () => void,
  getAnimationComments?: (animID: string) => Promise<void>,
  deleteComment?: (animID: string, commentID: string) => Promise<void>,
  clearComments?: () => void,
  uploadAnimation?: (formData: { title: string, upload: any }) => Promise<void>
};

export type ActionType =
  // General
  | { type: "ERROR"; payload: string }
  | { type: "CLEAR_ERRORS"; }
  | { type: "LOADING"; }
  | { type: "CLEAR_STATE"; }
  // Animations
  | { type: "ANIMATIONS_LOADED"; payload: { animations: Animation[], hasMore: boolean } }
  | { type: "MORE_ANIMATIONS_LOADED"; payload: { animations: Animation[], hasMore: boolean } }
  | { type: "ANIMATION_SELECTED"; payload: AnimationWithComments }
  | { type: "ANIMATION_SELECTION_CLEAR"; }
  // Comments
  | { type: "COMMENTS_LOADED"; payload: Comment[] }
  | { type: "COMMENT_DELETED"; payload: string }
  | { type: "COMMENTS_CLEAR"; }
  // Search
  | { type: "SEARCH_TEXT_SET"; payload: string }

export default (state: State, action: ActionType): State => {
  switch(action.type) {
    case "ANIMATIONS_LOADED":
      return {
        ...state,
        loading: false,
        animations: action.payload.animations,
        hasMore: action.payload.hasMore
      };
    case "MORE_ANIMATIONS_LOADED":
      console.log("more animations loaded");
      console.log(action.payload.animations);
      return {
        ...state,
        animations: state.animations.concat(action.payload.animations.slice(state.animations.length, action.payload.animations.length)),
        hasMore: action.payload.hasMore
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
    case "COMMENTS_LOADED":
      return {
        ...state,
        loading: false,
        comments: action.payload
      }
    case "COMMENT_DELETED":
      return {
        ...state,
        comments: state.comments.filter(comment => comment.id !== action.payload)
      }
    case "COMMENTS_CLEAR":
      return {
        ...state,
        comments: []
      }
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