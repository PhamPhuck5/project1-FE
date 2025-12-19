import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { register } from "../../../containers/auth/authContainer.js";

const Register = ({ toLogin }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: null,
    gender: "",
    phone: "",
  });

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert("Vui lòng nhập Họ Tên");
      return false;
    }
    if (!formData.email.trim()) {
      alert("Vui lòng nhập Email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Email không hợp lệ");
      return false;
    }
    if (!formData.password.trim()) {
      alert("Vui lòng nhập Mật khẩu");
      return false;
    }
    if (formData.password.length < 8) {
      alert("Mật khẩu phải có ít nhất 8 ký tự");
      return false;
    }
    if (!formData.phone.trim()) {
      alert("Vui lòng nhập Số điện thoại");
      return false;
    }
    if (!/^0\d{9}$/.test(formData.phone)) {
      alert("Số điện thoại không hợp lệ ");
      return false;
    }
    if (!formData.dateOfBirth) {
      alert("Vui lòng chọn Ngày sinh");
      return false;
    }
    if (!formData.gender) {
      alert("Vui lòng chọn Giới tính");
      return false;
    }
    return true;
  };

  // Hàm update input text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="row">
          <div className="col-12 col-lg-6">
            <label>Họ Tên</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-user"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <label>Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <label>Mật khẩu</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <label>Xác nhận lại mật khẩu</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-key"></i>
              </span>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <label>Ngày sinh</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-calendar"></i>
              </span>
              <Flatpickr
                value={formData.dateOfBirth || ""}
                onChange={(selectedDates) => {
                  setFormData((prev) => ({
                    ...prev,
                    dateOfBirth: selectedDates[0] || null,
                  }));
                }}
                options={{
                  dateFormat: "d/m/Y",
                  allowInput: true,
                  disableMobile: true,
                }}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <label>Giới tính</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-venus-mars"></i>
              </span>
              <input
                list="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-control"
              />
              <datalist id="gender">
                <option value="male" label="Nam"></option>
                <option value="female" label="Nữ"></option>
                <option value="other" label="Khác"></option>
              </datalist>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <label>Số điện thoại</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-phone"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <label className="mt-3 d-block">
          <input type="checkbox" name="is_agreed" /> Tôi cam kết tuân theo chính
          sách bảo mật và điều khoản sử dụng của BetaCinemas.
        </label>
        <div className="request">
          <button
            className="btn-sendrequest"
            onClick={async (e) => {
              e.preventDefault();
              if (formData.password != formData.confirmPassword) {
                alert("password không khớp");
                return;
              }
              if (!validateForm()) {
                return;
              }
              await register(
                formData.fullName,
                formData.email,
                formData.password,
                formData.phone,
                formData.dateOfBirth,
                formData.gender
              );
              console.log("end register");
              toLogin();
            }}
          >
            Đăng ký
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
