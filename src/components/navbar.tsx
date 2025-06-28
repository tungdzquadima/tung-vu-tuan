import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaTags, FaNewspaper, FaPhone, FaTimes, FaComments } from "react-icons/fa";
import "./Header/Header.css";
import "./Navbar.css";

const navItems = [
  { to: "/", label: "Trang chủ", icon: <FaHome /> },
  { to: "/products", label: "Sản phẩm", icon: <FaTags /> },
  { to: "/news", label: "Tin công nghệ", icon: <FaNewspaper /> },
];

function Navbar() {
  const location = useLocation();
  const [showContactPopup, setShowContactPopup] = useState(false);

  // Thêm useEffect để xử lý click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Kiểm tra nếu click không phải vào popup hoặc button liên hệ
      if (!target.closest('.contact-tooltip') && !target.closest('.nav-item')) {
        setShowContactPopup(false);
      }
    };

    // Thêm event listener khi popup hiện
    if (showContactPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContactPopup]);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactPopup(!showContactPopup);
  };

  const handleZaloClick = () => {
    window.open("https://zalo.me/0389055589", "_blank");
    setShowContactPopup(false);
  };

  return (
    <>
      <nav className="cps-navbar bg-transparent py-1">
        <ul className="nav justify-content-center align-items-center cps-navbar-list gap-2">
          {navItems.map((item) => (
            <li key={item.to} className="nav-item">
              <Link
                to={item.to}
                className={`nav-link d-flex align-items-center gap-2 cps-navbar-link${location.pathname === item.to ? " active" : ""}`}
              >
                <span className="cps-navbar-icon">{item.icon}</span>
                <span className="cps-navbar-label">{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="nav-item position-relative">
            <a
              href="#"
              onClick={handleContactClick}
              className="nav-link d-flex align-items-center gap-2 cps-navbar-link"
            >
              <span className="cps-navbar-icon"><FaPhone /></span>
              <span className="cps-navbar-label">Liên hệ</span>
            </a>
            {/* Contact Tooltip */}
            {showContactPopup && (
              <div className="contact-tooltip" onClick={handleZaloClick}>
                <div className="contact-tooltip-content">
                  <span className="contact-tooltip-icon"><FaComments /></span>
                  <span className="contact-tooltip-text">Liên hệ Zalo</span>
                </div>
                <div className="contact-tooltip-arrow"></div>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
