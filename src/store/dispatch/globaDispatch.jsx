import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setDispatch, getDispatchs } from "./dispatchInstance";
import actionTypes from "../actions/actionTypes.js";

//run only when app mount (1 time)
const GlobalDispatch = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    setDispatch(actionTypes.USER_LOGOUT, () => {
      dispatch({
        type: actionTypes.USER_LOGOUT,
      });
    });
  }, []);
  return <div></div>;
};

export default GlobalDispatch;
