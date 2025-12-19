import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Login from "./LoginContainer";
import Resiter from "./ResigterContainer";
import "./auth.scss";

import { FormattedMessage } from "react-intl";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLoging, setLoging] = useState(searchParams.get("target") == "login");

  return (
    <div className="auth-background">
      <div className="auth-container">
        <div className="row">
          <div className="col-6">
            <button
              className={isLoging ? "btn-auth-active" : "btn-auth"}
              onClick={() => {
                setLoging(true);
              }}
            >
              <FormattedMessage id="common.login" />
            </button>
          </div>
          <div className="col-6">
            <button
              className={isLoging ? "btn-auth" : "btn-auth-active"}
              onClick={() => {
                setLoging(false);
              }}
            >
              <FormattedMessage id="common.register" />
            </button>
          </div>
        </div>
        <div className="auth-content row">
          {isLoging ? (
            <Login />
          ) : (
            <Resiter
              toLogin={() => {
                setLoging(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
