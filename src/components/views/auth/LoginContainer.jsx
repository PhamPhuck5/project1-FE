import React, { useRef, useState } from "react";
import { login } from "../../../containers/auth/authContainer.js";
import { useDispatch } from "react-redux";
import actionTypes from "../../../store/actions/actionTypes.js";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "../../Modal/forgotPasswordModal.jsx";

const Login = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const modalShow = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <>
      <ForgotPasswordModal ref={modalShow} />
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="col-12">
          <label>Email</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fa-solid fa-envelope"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <div className="col-12">
          <label>Mật khẩu</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </div>
      </form>
      <span
        className="text-button forgot-password"
        onClick={() => {
          modalShow.current.show();
        }}
      >
        quên mật khẩu
      </span>
      <div className="request row">
        <div className="col-md-6 col-12 div-sendrequest">
          <button
            onClick={async () => {
              let userInfo = await login(email, password);
              let name = userInfo.name;
              let id = userInfo.id;
              dispatch({
                type: actionTypes.USER_LOGIN_SUCCESS,
                userInfo: { name: name, id: id },
              });
              navigate(-1);
            }}
          >
            Đăng nhập bằng tài khoản
          </button>
        </div>
        <div className="col-md-6 col-12 div-facebook-auth">
          <a
            href={import.meta.env.VITE_BACKEND_URL + "/facebook/auth"}
            className="button-like"
          >
            Đăng nhập bằng Facebook
          </a>
        </div>
      </div>
    </>
  );
};
export default Login;
