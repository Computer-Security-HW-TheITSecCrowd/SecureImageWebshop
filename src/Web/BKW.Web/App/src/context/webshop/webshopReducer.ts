import { Animation, AnimationWithComments, Comment } from '../../types';
import { initialState } from './webshopContext';

export interface State {
  animations: Animation[],
  hasMore: boolean,
  ownAnimations: Animation[],
  hasMoreOwn: boolean,
  selectedAnimation?: AnimationWithComments | null,
  comments: Comment[],
  images: Map<string, any>,
  searchText: string,
  gallerySearchText: string,
  loading: boolean,
  downloading: boolean,
  uploading: boolean,
  moreLoading: boolean,
  moreOwnLoading: boolean,
  error: string | null,
  getAnimations?: (filter: string, count?: number, loadingMore?: boolean) => Promise<void>,
  getOwnAnimations?: (filter: string, count?: number, loadingMore?: boolean) => Promise<void>,
  selectAnimation?: (animation: Animation) => Promise<void>,
  animationSelectionClear?: () => void,
  setSearchText?: (text: string, gallery?: boolean) => void,
  clearWebshopState?: () => void,
  deleteComment?: (animID: string, commentID: string) => Promise<void>,
  sendComment?: (animID: string, content: string) => Promise<void>,
  clearComments?: () => void,
  uploadAnimation?: (formData: { title: string, upload: any }) => Promise<void>,
  purchaseAnimation?: (animation: Animation) => Promise<void>,
  disableAnimation?: (animation: AnimationWithComments) => Promise<void>,
  downloadAnimation?: (animID: string, title: string) => Promise<void>
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
  | { type: "DISABLED_ANIMATION"; payload: AnimationWithComments }
  | { type: "DOWNLOADING"; }
  | { type: "UPLOADING"; }
  | { type: "MORE_LOADING"; }
  | { type: "MORE_OWN_LOADING"; }
  | { type: "DOWNLOAD_FINISHED"; }
  | { type: "UPLOAD_FINISHED"; }
  | { type: "PURCHASED_ANIMATION"; }
  // Comments
  | { type: "COMMENTS_LOADED"; payload: Comment[] }
  | { type: "COMMENT_DELETED"; payload: string }
  | { type: "COMMENT_SENT"; payload: Comment }
  | { type: "COMMENTS_CLEAR"; }
  // Search
  | { type: "SEARCH_TEXT_SET"; payload: string }
  | { type: "GALLERY_SEARCH_TEXT_SET"; payload: string }
  // Images
  | { type: "IMAGE_LOADED"; payload: { id: string, image: any } }

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
        hasMore: action.payload.hasMore,
        moreLoading: false
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
        hasMoreOwn: action.payload.hasMoreOwn,
        moreOwnLoading: false
      };
    case "ANIMATION_SELECTED":
      return {
        ...state,
        selectedAnimation: action.payload,
      };
    case "ANIMATION_SELECTION_CLEAR":
      return {
        ...state,
        selectedAnimation: null
      };
    case "DISABLED_ANIMATION":
      return {
        ...state,
        selectedAnimation: action.payload
      }
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
    case "COMMENT_SENT":
      return {
        ...state,
        comments: [ ...state.comments, action.payload ]
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
    case "MORE_LOADING":
      return {
        ...state,
        moreLoading: true
      };
    case "MORE_OWN_LOADING":
      return {
        ...state,
        moreOwnLoading: true
      };
    case "UPLOADING":
      return {
        ...state,
        uploading: true
      };
    case "UPLOAD_FINISHED":
      return {
        ...state,
        uploading: false
      };
    case "PURCHASED_ANIMATION":
      return state.selectedAnimation ? {
        ...state,
        selectedAnimation: {
          id: state.selectedAnimation.id,
          owner: state.selectedAnimation.owner,
          title: state.selectedAnimation.title,
          createdAt: state.selectedAnimation.createdAt,
          comments: state.selectedAnimation.comments,
          numberOfPurchase: state.selectedAnimation.numberOfPurchase,
          purchasedOrOwnedByUser: true,
          banned: state.selectedAnimation.banned
        }
      } : {
        ...state
      };
    case "DOWNLOADING":
      return {
        ...state,
        downloading: true
      };
    case "DOWNLOAD_FINISHED":
      return {
        ...state,
        downloading: false
      };
    case "IMAGE_LOADED":
      return {
        ...state,
        images: state.images.set(action.payload.id, action.payload.image)
      };
    case "CLEAR_STATE":
      return initialState;
    default:
      return {
        ...state
      };
  }
};