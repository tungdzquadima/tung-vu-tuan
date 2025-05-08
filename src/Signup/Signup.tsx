import React, { useState } from "react";
import "./css.css";
import instance from "../axios";
const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Ngăn reload trang
    console.log("Dữ liệu đăng ký:", formData);
    if (formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    // Kiểm tra đơn giản:
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ.");
      return;
    }

    // Gửi formData đến server hoặc xử lý tiếp...
    const user = {
      fullname: formData.fullname,
      email: formData.email,
      username: formData.username,
      password: formData.password,
    };
    try {
      const emailRes = await instance.get(`/users?email=${formData.email}`);
      if (emailRes.data.length > 0) {
        alert("Email đã được sử dụng. Vui lòng dùng email khác.");
        return;
      }
      const res1 = await instance.get(`/users?username=${formData.username}`);
      if (res1.data.length > 0) {
        alert("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.");
        return;
      }
      const res = await instance.post("/users", user);
      console.log("Đăng ký thành công:", res.data);
      alert("Đăng ký thành công!");
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      alert("Đăng ký thất bại.");
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
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={formData.username}
          onChange={handleChange}
          required
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
