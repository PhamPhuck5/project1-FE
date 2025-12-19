import actionTypes from "./actionTypes";

export const userLoginSuccess = (userInfo) => ({
  type: actionTypes.USER_LOGIN_SUCCESS,
  userInfo: userInfo,
});

export const userLoginFail = () => ({
  type: actionTypes.USER_LOGIN_FAIL,
});

export const userLogout = () => ({
  type: actionTypes.USER_LOGOUT,
});
