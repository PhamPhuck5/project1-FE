import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import actionTypes from "../../store/actions/actionTypes.js";

import { FormattedMessage } from "react-intl";

import { getDispatchs } from "../../store/dispatch/dispatchInstance.js";
import "./Header.scss";

const Header = () => {
  const navigate = useNavigate();
  let globalDispatcher = getDispatchs();
  let language = useSelector((state) => state.app.language);
  let isLogin = useSelector((state) => state.user.isLoggedIn);
  let userInfo = useSelector((state) => state.user.userInfo);
  console.log(isLogin);

  const dispatch = useDispatch();
  const [dd, mm, yyyy] = new Date().toLocaleDateString("vi-VN").split("/");

  let handleChangeLanguage = () => {
    if (language == "vi") {
      dispatch({ type: actionTypes.APP_CHANGE_TO_ENGLISH });
    } else {
      dispatch({ type: actionTypes.APP_CHANGE_TO_VIETNAMESE });
    }
  };

  return (
    <>
      <div className="row header-top">
        <div className="mx-auto header-top-container">
          <div className="header-top-content">
            {!isLogin ? (
              <>
                <Link to="/login?target=login" className="link-to-login">
                  login
                </Link>
                <Link to="/login?target=register" className="link-to-register">
                  register
                </Link>
              </>
            ) : (
              <>
                <p
                  className="text-white inline-block"
                  style={{ display: "inline", borderRight: "2em" }}
                >
                  <FormattedMessage id="common.hello" /> {userInfo.name}
                </p>

                <button
                  className="ml-2 bg-transparent text-white border-none"
                  onClick={() => globalDispatcher[actionTypes.USER_LOGOUT]()}
                >
                  <i className="fa-solid fa-right-from-bracket btn-change-language" />
                </button>
              </>
            )}
            <button
              className="btn-change-language"
              onClick={() => {
                handleChangeLanguage();
              }}
            >
              {language == "vi" ? (
                <img src="/icon/frag/united-kingdom.png" className="fragLang" />
              ) : (
                <img src="/icon/frag/vietnam.png" className="fragLang" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="row header-sticky">
        <div className="mx-auto header-top-container">
          <div className="second-header-content">
            <div
              className="logo on-hover-cursor"
              style={{ display: "inline-block" }}
              onClick={() => {
                navigate("/");
              }}
            ></div>
            <ul
              style={{
                display: "flex",
                gap: "5px",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li>
                {mm}/<strong>{yyyy}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
