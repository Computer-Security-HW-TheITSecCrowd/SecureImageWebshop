import React, { ReactNode, useReducer } from 'react';
import axios from 'axios';

import WebshopContext from './webshopContext';
import webshopReducer from './webshopReducer';
import { initialState } from './webshopContext';
import openNotification from '../../utils/notification';
import downloadBlob from '../../utils/downloadBlob';
import {
  animationsEndpoint,
  animationEndpoint,
  uploadAnimationEndpoint,
  commentEndpoint,
  userAnimationsEndpoint,
  animationDisableEndpoint,
  animationCommentsEndpoint,
  animationFileEndpoint
} from '../../constants/apiConstants';
import { InteractionError, Animation, AnimationWithComments } from '../../types';

const WebshopState: React.FC<ReactNode> = ({ children }) => {
  const [state, dispatch] = useReducer(webshopReducer, initialState);

  const setLoading = () => {
    dispatch({ type: 'LOADING' });
  };

  const startDownloading = () => {
    dispatch({ type: 'DOWNLOADING' });
  };

  const finishDownloading = () => {
    dispatch({ type: 'DOWNLOAD_FINISHED' });
  };

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  const handleError = (err: InteractionError) => {
    if (err.response) {
      dispatch({
        type: 'ERROR',
        payload: err.response.data,
      });
      openNotification('error', err.response.data);
    } else {
      dispatch({
        type: 'ERROR',
        payload: err.message,
      });
      openNotification('error', err.message);
    }
  };

  const getAnimations = async (filter: string, count: number = 10, loadingMore: boolean = false) => {
    try {
      !loadingMore && setLoading();
      const res =
        filter !== ''
          ? await axios.get(animationsEndpoint + `?count=${count}&search=${filter}`)
          : await axios.get(animationsEndpoint + `?count=${count}`);
      dispatch({
        type: loadingMore ? 'MORE_ANIMATIONS_LOADED' : 'ANIMATIONS_LOADED',
        payload: {
          animations: res.data,
          hasMore: res.data.length === count
        },
      });
      clearErrors();
    } catch (err) {
      handleError(err);
    }
  };

  const getOwnAnimations = async (filter: string, count: number = 10, loadingMore: boolean = false) => {
    try {
      !loadingMore && setLoading();
      const res = await axios.get(userAnimationsEndpoint + `?count=${count}${filter ? `&search=${filter}` : ''}`);
      dispatch({
        type: loadingMore ? 'MORE_OWN_ANIMATIONS_LOADED' : 'OWN_ANIMATIONS_LOADED',
        payload: {
          ownAnimations: res.data,
          // The query returns 'count' of the owned animations and 'count' of the purchased animations. 
          // It means that we know that there is no more data for sure only if the returned animation
          // count is less than 'count' (because none of the two categories could fill its quota).
          hasMoreOwn: res.data.length >= count
        },
      });
      clearErrors();
    } catch (err) {
      handleError(err);
    }
  };

  const uploadAnimation = async (formData: { title: string, upload: any }) => {
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('formFile', formData.upload);
      await axios.post(uploadAnimationEndpoint, data);
      openNotification('success', `${formData.title} uploaded`);
    } catch (err) {
      handleError(err);
    }
  };

  const selectAnimation = async (animation: Animation) => {
    try {
      const res = await axios.get(animationEndpoint(animation.id));
      console.log(res.data);
      dispatch({
        type: 'ANIMATION_SELECTED',
        payload: res.data,
      });
    } catch (err) {
      handleError(err);
    }
  };

  const animationSelectionClear = () => {
    dispatch({ type: 'ANIMATION_SELECTION_CLEAR' });
  };

  const getAnimationComments = async (animID: string) => {
    try {
      setLoading();

      const res = await axios.get(animationEndpoint(animID));
      console.log(res);
      
      dispatch({
        type: 'COMMENTS_LOADED',
        payload: res.data.comments
      })

      clearErrors();
    } catch (err) {
      handleError(err);
    }
  };

  const deleteComment = async (animID: string, commentID: string) => {
    try {
      const res = await axios.delete(commentEndpoint(animID, commentID))

      dispatch({
        type: "COMMENT_DELETED",
        payload: commentID
      });
      openNotification('info', 'Comment deleted')
    } catch (err) {
      handleError(err);
    }
  }

  const sendComment = async (animID: string, content: string) => {
    try {
      const res = await axios.post(animationCommentsEndpoint(animID), { content })

      dispatch({
        type: "COMMENT_SENT",
        payload: res.data
      })
      openNotification('success', 'Comment sent')
    } catch (err) {
      handleError(err);
    }
  }

  const clearComments = () => {
    dispatch({
      type: 'COMMENTS_CLEAR'
    })
  }

  const setSearchText = (text: string, gallery: boolean = false) => {
    dispatch({
      type: gallery ? 'GALLERY_SEARCH_TEXT_SET' : 'SEARCH_TEXT_SET',
      payload: text,
    });
  };

  const clearWebshopState = () => {
    dispatch({ type: 'CLEAR_STATE' });
  };

  const purchaseAnimation = async (animation: Animation) => {
    try {
      const res = await axios.put(userAnimationsEndpoint, { animID: animation.id })
      console.log(res.data);
      openNotification('success', 'Animation purchased');
    } catch (err) {
      handleError(err);
    }
  }

  const disableAnimation = async (animation: Animation) => {
    console.log("disable animation STATE");

    try {
      const res = await axios.post(animationDisableEndpoint(animation.id));

      state.selectedAnimation && dispatch({
        type: 'DISABLED_ANIMATION',
        payload: {
          id: state.selectedAnimation.id,
          owner: state.selectedAnimation.owner,
          title: state.selectedAnimation.title,
          createdAt: state.selectedAnimation.createdAt,
          comments: state.selectedAnimation.comments,
          numberOfPurchase: state.selectedAnimation.numberOfPurchase,
          banned: true
        }
      });
      openNotification('info', 'Animation disabled');
    } catch (err) {
      handleError(err);
    }
  }

  const downloadAnimation = async (animID: string, title: string) => {
    startDownloading();
    try {
      const res = await axios.get(animationFileEndpoint(animID));
      const blob = new Blob(
        [ res.data ],
        { type: 'application/octet-stream' }
      );
      downloadBlob(blob, `${title}.caff`);
    } catch (err) {
      openNotification('error', 'Download failed');
    } finally {
      finishDownloading();
    }
  };

  return (
    <WebshopContext.Provider
      value={{
        animations: state.animations,
        hasMore: state.hasMore,
        ownAnimations: state.ownAnimations,
        hasMoreOwn: state.hasMoreOwn,
        comments: state.comments,
        selectedAnimation: state.selectedAnimation,
        searchText: state.searchText,
        gallerySearchText: state.gallerySearchText,
        loading: state.loading,
        downloading: state.downloading,
        error: state.error,
        getAnimations,
        selectAnimation,
        animationSelectionClear,
        getAnimationComments,
        deleteComment,
        sendComment,
        clearComments,
        setSearchText,
        clearWebshopState,
        uploadAnimation,
        getOwnAnimations,
        purchaseAnimation,
        disableAnimation,
        downloadAnimation
      }}
    >
      {children}
    </WebshopContext.Provider>
  );
};

export default WebshopState;
