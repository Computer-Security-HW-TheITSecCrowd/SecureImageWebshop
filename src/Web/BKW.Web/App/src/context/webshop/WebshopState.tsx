import React, { ReactNode, useReducer } from 'react';
import axios from 'axios';

import WebshopContext from './webshopContext';
import webshopReducer from './webshopReducer';
import { initialState } from './webshopContext';
import openNotification from '../../utils/notification';
import { animationEndpoint, animationsEndpoint, uploadAnimationEndpoint } from '../../constants/apiConstants';
import { InteractionError, Animation } from '../../types';
import reportWebVitals from '../../reportWebVitals';

const WebshopState: React.FC<ReactNode> = ({ children }) => {
  const [state, dispatch] = useReducer(webshopReducer, initialState);

  const setLoading = () => {
    dispatch({ type: 'LOADING' });
  };

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  const handleError = (err: InteractionError) => {
    if (err.response) {
      dispatch({
        type: 'ERROR',
        payload: err.response.data.msg,
      });
      openNotification('error', err.response.data.msg);
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

  const uploadAnimation = async (formData: { title: string, upload: any }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const data = {
        "title": formData.title,
        //"file": formData.upload
      };
      console.log(data);
      await axios.post(uploadAnimationEndpoint, data, config);
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

  const setSearchText = (text: string) => {
    dispatch({
      type: 'SEARCH_TEXT_SET',
      payload: text,
    });
  };

  const clearWebshopState = () => {
    dispatch({ type: 'CLEAR_STATE' });
  };

  return (
    <WebshopContext.Provider
      value={{
        animations: state.animations,
        hasMore: state.hasMore,
        selectedAnimation: state.selectedAnimation,
        searchText: state.searchText,
        loading: state.loading,
        error: state.error,
        getAnimations,
        selectAnimation,
        animationSelectionClear,
        setSearchText,
        clearWebshopState,
        uploadAnimation,
      }}
    >
      {children}
    </WebshopContext.Provider>
  );
};

export default WebshopState;
