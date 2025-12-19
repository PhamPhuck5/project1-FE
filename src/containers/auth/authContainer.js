import api from "../../axios.js";
import axios from "axios";

import { getDispatchs } from "../../store/dispatch/dispatchInstance.js";
import actionTypes from "../../store/actions/actionTypes.js";

let dispatchInstance = getDispatchs();

export const login = async (email, password) => {
  try {
    const res = await api.post(
      `/api/login`,
      {
        email: email,
        password: password,
      },
      {}
    );
    localStorage.setItem("accessToken", res.accessToken);
    // localStorage.setItem("refreshToken", res.refreshToken);
    return res;
  } catch (err) {
    if (axios.isCancel(err)) return;
    console.error("error: ", err.message);
  }
};

export const saveAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const register = async (
  name,
  email,
  password,
  phonenumber,
  dateOfBirth,
  gender
) => {
  try {
    const res = await api.post(
      `/api/register`,
      {
        email: email,
        password: password,
        name: name,
        phonenumber: phonenumber,
        dateOfBirth: dateOfBirth,
        gender: gender,
      },
      {}
    );

    console.log(res);

    // localStorage.setItem("refreshToken", res.refreshToken);
  } catch (err) {
    if (axios.isCancel(err)) return;
    console.error("error: ", err.message);
  }
};

export const changePassword = async (email) => {
  try {
    const res = await api.post(
      `/api/forgot`,
      {
        email: email,
      },
      {}
    );

    console.log(res);
    return res;
  } catch (err) {
    if (axios.isCancel(err)) return;
    console.error("error: ", err.message);
  }
};
export const token_expired = () => {
  dispatchInstance[actionTypes.USER_LOGOUT]();
  localStorage.removeItem("accessToken");
  alert("login session expired");
};
