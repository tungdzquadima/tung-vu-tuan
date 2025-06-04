// import React, { useState } from "react";
// import instance from "../../axios"; // Giả sử bạn đã có instance
// import "./css.css";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     try {
//       // Kiểm tra nếu username và password đúng
//       const res = await instance.get(
//         `/users?username=${formData.username}&password=${formData.password}`
//       );

//       if (res.data.length === 0) {
//         alert("Tên đăng nhập hoặc mật khẩu không đúng!");
//         return;
//       }

//       console.log("Đăng nhập thành công:", res.data);
//       alert("Đăng nhập thành công!");

//       if (formData.username === "admin" && formData.password === "abc123") {
//         navigate("/admin"); // Chuyển hướng đến trang admin
//         return;
//       }
//       localStorage.setItem("isLoggedIn", "true"); // đoạn này là lưu đăng nhập
//       localStorage.setItem("fullname", res.data[0].fullname);
//       localStorage.setItem("username", res.data[0].username);

//       // Sau khi đăng nhập thành công, có thể chuyển trang hoặc lưu thông tin người dùng
//       navigate("/products");
//       window.location.reload();
//     } catch (error) {
//       console.error("Lỗi khi đăng nhập:", error);
//       alert("Đăng nhập thất bại.");
//     }
//   };

//   return (
//     <div className="hcn">
//       <h1>Nhập Thông Tin Đăng Nhập</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="username"
//           placeholder="Tên đăng nhập"
//           value={formData.username}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Mật khẩu"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Đăng nhập</button>
//       </form>
//     </div>
//   );
// }

// export default Login;

// chatgpt

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
      console.log(decoded);
      
      const roleId = decoded.role_id || decoded.roleId;
      console.log(roleId);
      
      if (!roleId) {
        alert("Không xác định được quyền truy cập.");
        return;
      }

      // Lưu token và thông tin user cơ bản
      localStorage.setItem("token", token);
      localStorage.setItem("phone_number", formData.phone_number);
      localStorage.setItem("role_id", roleId);

      alert("Đăng nhập thành công!");

      // Điều hướng theo role
      if (roleId === 1) {
        navigate("/admin");
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
