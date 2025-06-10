import { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { link } from "fs";

function Header({ categories, onCategoryChange }: { categories: any[], onCategoryChange: (categoryId: number) => void }) {
  const navigate = useNavigate();
 // console.log("Header component rendered with categories:", categories);

  const phoneNumber = localStorage.getItem("phone_number");
  const fullName = localStorage.getItem("full_name");
  const address = localStorage.getItem("address");
  const dateOfBirth = localStorage.getItem("date_of_birth");
  const roleId = localStorage.getItem("role_id");

  // Đăng xuất và xoá thông tin khỏi localStorage
  const handleLogout = () => {
    localStorage.clear();
    navigate("/products"); // Điều hướng đến trang sản phẩm hoặc trang login
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleUserMouseEnter = () => setIsUserMenuOpen(true);
  const handleUserMouseLeave = () => setIsUserMenuOpen(false);

  return (
    <header>
      <nav className="main-nav">
        <ul className="nav-left">
          {/* Danh mục dropdown */}
          <li
            className="category-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="category-button">Danh mục</button>
            {isDropdownOpen && (
              <Link to="/products">
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category.id} onClick={() => onCategoryChange(category.id)}>
                      {category.name}
                    </li>
                  ))}
                </ul>
              </Link>
              
            )}
          </li>
        </ul>

        {/* Thanh tìm kiếm */}
        <div className="search-container">
          <div className="search-wrapper">
            <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm..."
            
          />
          <button className="search-button">🔍</button>
            </div>
          
        </div>

        <div className="nav-right">
          {fullName ? (
            <div
              className="user-dropdown"
              onMouseEnter={handleUserMouseEnter}
              onMouseLeave={handleUserMouseLeave}
            >
              <span className="fullname">Xin chào, {fullName}</span>
              {isUserMenuOpen && (
                <ul className="dropdown-menu user-menu">
                  <li><Link to="/orders">Đơn hàng</Link></li>
                  <li><Link to="/profile">Thông tin khách hàng</Link></li>
                  <li onClick={handleLogout}>Đăng xuất</li>
                </ul>
              )}
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
