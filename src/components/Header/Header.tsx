import { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();


const phoneNumber = localStorage.getItem("phone_number");
const fullName = localStorage.getItem("full_name");
const address = localStorage.getItem("address");
const dateOfBirth = localStorage.getItem("date_of_birth");
const roleId = localStorage.getItem("role_id");

// console.log("Thông tin người dùng: dang o header");
// console.log("Phone Number:", phoneNumber);
// console.log("Full Name:", fullName);
// console.log("Address:", address);
// console.log("Date of Birth:", dateOfBirth);
// console.log("Role ID:", roleId);


  // Lấy thông tin full name và kiểm tra trạng thái đăng nhập
  
  // Đăng xuất và xoá thông tin khỏi localStorage
  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/products"); // Điều hướng đến trang sản phẩm hoặc trang login
  };

  return (
    <header>
      <nav className="main-nav">
        <ul className="nav-left">
          <li>
            <Link to="/products">HOME</Link>
          </li>
          <li>
            <Link to="/about">ABOUT</Link>
          </li>
          <li>
            <Link to="/products">SHOP</Link>
          </li>
        </ul>

        {/* Thanh tìm kiếm */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
          />
          <button className="search-button">🔍</button>
        </div>

        <div className="nav-right">
          {fullName ? (
            <div className="auth-info">
              <span className="fullname">Xin chào, {fullName}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">LOGIN</Link>
              <Link to="/signup">SIGNUP</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
