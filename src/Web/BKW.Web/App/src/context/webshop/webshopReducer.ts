import { Animation, AnimationWithComments, Comment } from '../../types';
import { initialState } from './webshopContext';

export interface State {
  animations: Animation[],
  hasMore: boolean,
  ownAnimations: Animation[],
  hasMoreOwn: boolean,
  selectedAnimation?: AnimationWithComments | null,
  comments: Comment[],
  searchText: string,
  gallerySearchText: string,
  loading: boolean,
  error: string | null,
  getAnimations?: (filter: string, count?: number, loadingMore?: boolean) => Promise<void>,
  getOwnAnimations?: (filter: string, count?: number, loadingMore?: boolean) => Promise<void>,
  selectAnimation?: (animation: Animation) => Promise<void>,
  animationSelectionClear?: () => void,
  setSearchText?: (text: string, gallery?: boolean) => void,
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
  | { type: "OWN_ANIMATIONS_LOADED"; payload: { ownAnimations: Animation[], hasMoreOwn: boolean } }
  | { type: "MORE_OWN_ANIMATIONS_LOADED"; payload: { ownAnimations: Animation[], hasMoreOwn: boolean } }
  | { type: "ANIMATION_SELECTED"; payload: AnimationWithComments }
  | { type: "ANIMATION_SELECTION_CLEAR"; }
  // Comments
  | { type: "COMMENTS_LOADED"; payload: Comment[] }
  | { type: "COMMENT_DELETED"; payload: string }
  | { type: "COMMENTS_CLEAR"; }
  // Search
  | { type: "SEARCH_TEXT_SET"; payload: string }
  | { type: "GALLERY_SEARCH_TEXT_SET"; payload: string }

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
      return {
        ...state,
        animations: state.animations.concat(action.payload.animations.slice(state.animations.length, action.payload.animations.length)),
        hasMore: action.payload.hasMore
      };
    case "OWN_ANIMATIONS_LOADED":
      return {
        ...state,
        loading: false,
        ownAnimations: action.payload.ownAnimations,
        hasMoreOwn: action.payload.hasMoreOwn
      };
    case "MORE_OWN_ANIMATIONS_LOADED":
      return {
        ...state,
        ownAnimations: state.ownAnimations.concat(action.payload.ownAnimations.slice(state.ownAnimations.length, action.payload.ownAnimations.length)),
        hasMoreOwn: action.payload.hasMoreOwn
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
    case "GALLERY_SEARCH_TEXT_SET":
      return {
        ...state,
        gallerySearchText: action.payload
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