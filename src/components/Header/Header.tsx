import { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
function Header() {
  const [fullname, setFullname] = useState("");
  const navigate = useNavigate();

  // lấy thông tin full name tài khoản đang đăng nhập
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedName = localStorage.getItem("fullname");
    console.log(storedName);

    if (isLoggedIn === "true" && storedName) {
      setFullname(storedName);
      console.log(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("fullname");
    setFullname("");
    navigate("/products"); // hoặc navigate("/login");
  };
  return (
    <>
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

          <div className="nav-right">
            {fullname ? (
              <div className="auth-info">
                <span className="fullname">Xin chào, {fullname}</span>
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
    </>
  );
}
export default Header;
