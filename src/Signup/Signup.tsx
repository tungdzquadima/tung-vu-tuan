// import React, { useState } from "react";
// import "./css.css";
// import instance from "../axios";
// const Signup = () => {
//   const [formData, setFormData] = useState({
//     fullname: "",
//     phone: "",
//     address:"",
//     username: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault(); // Ngăn reload trang
//     console.log("Dữ liệu đăng ký:", formData);
//     if (formData.password.length < 6) {
//       alert("Mật khẩu phải có ít nhất 6 ký tự.");
//       return;
//     }

//     // Kiểm tra đơn giản:
//     if (formData.password !== formData.confirmPassword) {
//       alert("Mật khẩu không khớp!");
//       return;
//     }
//     // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     // if (!emailRegex.test(formData.email)) {
//     //   alert("Email không hợp lệ.");
//     //   return;
//     // }

//     // Gửi formData đến server hoặc xử lý tiếp...
//     const user = {
//       fullname: formData.fullname,
//       email: formData.phone,
//       username: formData.username,
//       password: formData.password,
//     };
//     try {
//       const emailRes = await instance.get(`/users?email=${formData.phone}`);
//       if (emailRes.data.length > 0) {
//         alert("Email đã được sử dụng. Vui lòng dùng email khác.");
//         return;
//       }
//       const res1 = await instance.get(`/users?username=${formData.username}`);
//       if (res1.data.length > 0) {
//         alert("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.");
//         return;
//       }
//       const res = await instance.post("/users", user);
//       console.log("Đăng ký thành công:", res.data);
//       alert("Đăng ký thành công!");
//     } catch (error) {
//       console.error("Lỗi khi đăng ký:", error);
//       alert("Đăng ký thất bại.");
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h1>Đăng Ký</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="fullname"
//           placeholder="Họ và tên"
//           value={formData.fullname}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="phone"
//           name="phone"
//           placeholder="Số Điện Thoại"
//           value={formData.phone}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="address"
//           name="address"
//           placeholder="Địa Chỉ"
//           value={formData.address}
//           onChange={handleChange}
//           required
//         />
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
//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Xác nhận mật khẩu"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Đăng ký</button>
//       </form>
//     </div>
//   );
// };
// export default Signup;



// chatgpt

import React, { useState } from "react";
import "./css.css";
import instance from "../axios";

const Signup = () => {
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
