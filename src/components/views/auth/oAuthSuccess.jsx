import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { saveAccessToken } from "../../../containers/auth/authContainer";
import { useDispatch } from "react-redux";
import actionTypes from "../../../store/actions/actionTypes";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = searchParams.get("token");
  const name = searchParams.get("name");
  saveAccessToken(token);

  dispatch({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: { name: name },
  });
  navigate("/home");
  return <></>;
};

export default OAuthSuccess;
