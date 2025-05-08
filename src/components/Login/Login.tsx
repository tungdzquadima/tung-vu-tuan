import React, { useState } from "react";
import instance from "../../axios"; // Giả sử bạn đã có instance
import "./css.css";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // Kiểm tra nếu username và password đúng
      const res = await instance.get(
        `/users?username=${formData.username}&password=${formData.password}`
      );

      if (res.data.length === 0) {
        alert("Tên đăng nhập hoặc mật khẩu không đúng!");
        return;
      }

      console.log("Đăng nhập thành công:", res.data);
      alert("Đăng nhập thành công!");

      if (formData.username === "admin" && formData.password === "abc123") {
        navigate("/admin"); // Chuyển hướng đến trang admin
        return;
      }
      localStorage.setItem("isLoggedIn", "true"); // đoạn này là lưu đăng nhập
      localStorage.setItem("fullname", res.data[0].fullname);

      // Sau khi đăng nhập thành công, có thể chuyển trang hoặc lưu thông tin người dùng
      navigate("/products");
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      alert("Đăng nhập thất bại.");
    }
  };

  return (
    <div className="hcn">
      <h1>Nhập Thông Tin Đăng Nhập</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;
