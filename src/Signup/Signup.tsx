import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css.css";
import instance from "../axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    const payload = {
      fullname: formData.fullname,
      phone_number: formData.phone_number,
      address: formData.address,
      password: formData.password,
      retype_password: formData.confirmPassword,
      date_of_birth: formData.date_of_birth || "2000-01-01",
      facebook_account_id: 0,
      google_account_id: 0,
      role_id: 2,
    };

    try {
      const res = await instance.post("/api/v1/users/register", payload);
      console.log("Đăng ký thành công:", res.data);
      alert("Đăng ký thành công!");
      setFormData({
        fullname: "",
        phone_number: "",
        address: "",
        date_of_birth: "",
        password: "",
        confirmPassword: "",
      });
      navigate('/login');
    } catch (error: any) {
      if (error.response) {
        console.error("Lỗi response từ server:", error.response.data);
        alert("Đăng ký thất bại: " + (error.response.data.message || JSON.stringify(error.response.data)));
      } else if (error.request) {
        console.error("Không nhận được phản hồi:", error.request);
        alert("Không nhận được phản hồi từ server.");
      } else {
        console.error("Lỗi khi xử lý request:", error.message);
        alert("Lỗi khi xử lý request: " + error.message);
      }
    }
  };

  return (
    <div className="signup-container">
      <h1>Đăng Ký</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullname"
          placeholder="Họ và tên"
          value={formData.fullname}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone_number"
          placeholder="Số điện thoại"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date_of_birth"
          placeholder="Ngày sinh"
          value={formData.date_of_birth}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default Signup;
