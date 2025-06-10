import React, { useState } from "react";
import instance from "../../axios"; // axios instance đã config baseURL
import "./css.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
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

    try {
      // Gửi POST login
      const res = await instance.post("/api/v1/users/login", {
        phone_number: formData.phone_number,
        password: formData.password,
      });

      const token = res.data; // Giả sử backend trả token thuần

      // Giải mã token để lấy role_id và các thông tin khác
      const decoded: any = jwtDecode(token);
      console.log("Decoded token:", decoded); // In ra thông tin đã giải mã để kiểm tra

      const roleId = decoded.role_id || decoded.roleId;
      console.log(roleId);

      if (!roleId) {
        alert("Không xác định được quyền truy cập.");
        return;
      }

      // Lưu token và trạng thái đăng nhập vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true"); // Đánh dấu trạng thái đăng nhập

      // Gọi API để lấy thông tin người dùng
      const userInfoRes = await instance.get("/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = userInfoRes.data; // Giả sử API trả về thông tin người dùng
      console.log("User info:", userInfoRes.data); // In ra thông tin người dùng để kiểm tra

      // Chuyển đổi ngày sinh sang múi giờ +7 (Asia/Ho_Chi_Minh)
      const dateOfBirthUTC = new Date(user.date_of_birth); // Giả sử ngày sinh từ API là UTC
      const dateOfBirthFormatted = dateOfBirthUTC.toLocaleString("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      // Lưu các thông tin người dùng vào localStorage
      localStorage.setItem("phone_number", user.phone_number);
      localStorage.setItem("role_id", roleId);
      localStorage.setItem("full_name", user.fullname);  // Lưu fullName
      localStorage.setItem("address", user.address);  // Lưu address
      localStorage.setItem("date_of_birth", dateOfBirthFormatted);  // Lưu date_of_birth sau khi chuyển múi giờ

      alert("Đăng nhập thành công!");
      const phoneNumber = localStorage.getItem("phone_number");
      const fullName = localStorage.getItem("full_name");
      const address = localStorage.getItem("address");
      const dateOfBirth = localStorage.getItem("date_of_birth");

      console.log("Thông tin người dùng:");

      console.log("Phone Number:", phoneNumber);
      console.log("Full Name:", fullName);
      console.log("Address:", address);
      console.log("Date of Birth:", dateOfBirth);
      console.log("Role ID:", roleId);

      // Điều hướng theo role
      if (roleId === 1) {
        navigate("/AdminPage");
      } else if (roleId === 2) {
        navigate("/products");
      } else {
        alert("Role không hợp lệ.");
      }
    } catch (error: any) {
      if (error.response) {
        alert("Đăng nhập thất bại: " + (error.response.data.message || "Sai thông tin đăng nhập"));
      } else {
        alert("Lỗi kết nối đến server.");
      }
    }
  };

  return (
    <div className="hcn">
      <h1>Nhập Thông Tin Đăng Nhập</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          name="phone_number"
          placeholder="Số điện thoại"
          value={formData.phone_number}
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
