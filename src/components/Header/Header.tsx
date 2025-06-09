import { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";

function Header({ categories, onCategoryChange }: { categories: any[], onCategoryChange: (categoryId: number) => void }) {
  const navigate = useNavigate();
  console.log("Header component rendered with categories:", categories);
  

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
      <ul className="dropdown-menu">
        {categories.map((category) => (
          <li key={category.id} onClick={() => onCategoryChange(category.id)}>
            {category.name}
          </li>
        ))}
      </ul>
    )}
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
