import React, { ReactNode, useReducer } from 'react';
import axios from 'axios';

import WebshopContext from './webshopContext';
import webshopReducer from './webshopReducer';
import { initialState } from './webshopContext';
import openNotification from '../../utils/notification';
import { animationsEndpoint } from '../../constants/apiConstants';
import { InteractionError, Animation } from '../../types';

const WebshopState: React.FC<ReactNode> = ({ children }) => {
  const [state, dispatch] = useReducer(webshopReducer, initialState);

  const setLoading = () => {
    dispatch({ type: "LOADING" });
  };

  const clearErrors = () => {
    dispatch({ type: "CLEAR_ERRORS" });
  };

  const handleError = (err: InteractionError) => {
    if (err.response) {
      dispatch({
        type: "ERROR",
        payload: err.response.data.msg,
      });
      openNotification('error', err.response.data.msg);
    } else {
      dispatch({
        type: "ERROR",
        payload: err.message,
      });
      openNotification('error', err.message);
    }
  };

  const getAnimations = async (filter: string) => {
    try {
      setLoading();
      const res = await axios.get(animationsEndpoint + `?title_like=${filter}`);
      dispatch({
        type: "ANIMATIONS_LOADED",
        payload: res.data
      });
      clearErrors();
    } catch (err) {
      handleError(err);
    }
  };

  const selectAnimation = async (animation: Animation) => {
    dispatch({
      type: "ANIMATION_SELECTED",
      payload: animation
    });
  };

  const animationSelectionClear = () => {
    dispatch({ type: "ANIMATION_SELECTION_CLEAR" });
  };

  const setSearchText = (text: string) => {
    dispatch({
      type: "SEARCH_TEXT_SET",
      payload: text
    });
  };

  const clearWebshopState = () => {
    dispatch({ type: "CLEAR_STATE" });
  };

  return (
    <WebshopContext.Provider
      value={{
        animations: state.animations,
        selectedAnimation: state.selectedAnimation,
        searchText: state.searchText,
        loading: state.loading,
        error: state.error,
        getAnimations,
        selectAnimation,
        animationSelectionClear,
        setSearchText,
        clearWebshopState
      }}
    >
      {children}
    </WebshopContext.Provider>
  );
};

export default WebshopState;