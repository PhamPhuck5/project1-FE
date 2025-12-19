import axios from "axios";
import _ from "lodash";
import { token_expired } from "./containers/auth/authContainer.js";

import config from "./config";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

const createError = (
  httpStatusCode,
  statusCode,
  errorMessage,
  problems,
  errorCode = ""
) => {
  const error = new Error();
  error.httpStatusCode = httpStatusCode;
  error.statusCode = statusCode;
  error.errorMessage = errorMessage;
  error.problems = problems;
  error.errorCode = errorCode + "";
  return error;
};

export const isSuccessStatusCode = (s) => {
  // May be string or number
  const statusType = typeof s;
  return (
    (statusType === "number" && s === 200) ||
    (statusType === "string" && s.toUpperCase() === "OK")
  );
};

// // Flag avoid refresh more than 1
// let isRefreshing = false;
// let failedQueue = [];

// // resolve queue retry
// const processQueue = (error, token = null) => {
//   failedQueue.forEach((p) => {
//     if (error) {
//       p.reject(error);
//     } else {
//       p.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
instance.interceptors.response.use(
  (response) => {
    // Thrown error for request with OK status code
    const { data } = response;
    console.log(data);

    // Return direct data to callback
    if (data.hasOwnProperty("status") && data.hasOwnProperty("data")) {
      return data["data"];
    }
    // Handle special case
    if (data.hasOwnProperty("status") && _.keys(data).length === 1) {
      return null;
    }
    return response.data;
  },
  (error) => {
    const { response } = error;
    if (response == null) {
      return Promise.reject(error);
    }

    const { data } = response;
    if (data.hasOwnProperty("status") && !isSuccessStatusCode(data["status"])) {
      // use token rotation
      // if (data["status"] == 401 && data["message"] == "Token expired") {
      //   if (isRefreshing) {
      //     // Nếu đang refresh thì chờ
      //     return new Promise((resolve, reject) => {
      //       failedQueue.push({ resolve, reject });
      //     })
      //       .then((token) => {
      //         originalRequest.headers["Authorization"] = `Bearer ${token}`;
      //         return api(originalRequest);
      //       })
      //       .catch((error) => Promise.reject(error));
      //   }

      //   originalRequest._retry = true;
      //   isRefreshing = true;

      //   try {
      //     // todo to do Gọi API refresh token

      //     const newAccessToken =
      //       "the new token the recive from the todo in top this";

      //     // Gắn lại vào headers cho instance
      //     api.defaults.headers.common[
      //       "Authorization"
      //     ] = `Bearer ${newAccessToken}`;
      //     processQueue(null, newAccessToken);

      //     return api(originalRequest); // retry request cũ
      //   } catch (refreshError) {
      //     processQueue(refreshError, null);
      //     return Promise.reject(refreshError);
      //   } finally {
      //     isRefreshing = false;
      //   }
      // }
      if (data.hasOwnProperty("errCode") && data["errCode"] == "login") {
        console.log("need to login again");
        token_expired();
      }
      return Promise.reject(
        createError(
          response.status, //http status
          data["status"],
          data["message"],
          null,
          data["errcode"] ? data["errcode"] : ""
        )
      );
    }

    if (data.hasOwnProperty("status") && data.hasOwnProperty("message")) {
      return Promise.reject(
        createError(response.status, data["status"], data["message"])
      );
    }

    return Promise.reject(createError(response.status));
  }
);

export default instance;
