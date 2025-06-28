import { useState, useEffect } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaPhoneAlt, FaTruck, FaUser, FaSearch, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../../logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import instance from "../../axios";

function Header({ categories, onCategoryChange }: { categories: any[], onCategoryChange: (categoryId: number) => void }) {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [loginForm, setLoginForm] = useState({ phone: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("token") !== null;
  });
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    // Nếu không có userInfo, thử lấy từ các field riêng lẻ trong localStorage
    const fullName = localStorage.getItem("full_name");
    const phoneNumber = localStorage.getItem("phone_number");
    const address = localStorage.getItem("address");
    const dateOfBirth = localStorage.getItem("date_of_birth");
    
    if (fullName) {
      return {
        name: fullName,
        phone: phoneNumber || "",
        address: address || "",
        dateOfBirth: dateOfBirth || "",
        email: phoneNumber || ""
      };
    }
    
    return { name: "Nguyễn Văn A", email: "user@example.com", phone: "" };
  });

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Load thông tin user nếu chưa có
      if (!localStorage.getItem("userInfo")) {
        loadUserInfo();
      }
    } else {
      setIsLoggedIn(false);
    }

    // Thêm event listener để theo dõi thay đổi localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        if (e.newValue) {
          setIsLoggedIn(true);
          // Load thông tin user mới
          loadUserInfo();
        } else {
          setIsLoggedIn(false);
        }
      }
    };

    // Thêm event listener cho storage change
    window.addEventListener('storage', handleStorageChange);

    // Thêm custom event listener cho login success
    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
      loadUserInfo();
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, []);

  const handleSearch = () => {
    if (searchKeyword.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleActionClick = (action: string) => {
    if (action === 'profile') {
      // Load thông tin user từ database khi click vào profile
      loadUserInfo();
      setShowProfilePopup(true);
      return;
    }
    
    if (action === 'login') {
      navigate('/login');
      return;
    }
    
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    } else {
      if (action === 'order') {
        navigate('/orders');
      }
    }
  };

  const loadUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Không có token");
        return;
      }

      // Gọi API để lấy thông tin user hiện tại với token
      const response = await instance.get("/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data;
      console.log("User info from Header:", user);

      // Chuyển đổi ngày sinh sang múi giờ +7
      const dateOfBirthUTC = new Date(user.date_of_birth);
      const dateOfBirthFormatted = dateOfBirthUTC.toLocaleString("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      // Tạo object userInfo với format phù hợp
      const userData = {
        name: user.fullname,
        email: user.phone_number, // Dùng phone_number làm email
        phone: user.phone_number,
        address: user.address,
        dateOfBirth: dateOfBirthFormatted,
        id: user.id
      };

      setUserInfo(userData);
      localStorage.setItem("userInfo", JSON.stringify(userData));
    } catch (error: any) {
      console.error('Load user info error:', error);
      // Nếu không load được thì dùng thông tin cũ từ localStorage
      const savedUser = localStorage.getItem("userInfo");
      if (savedUser) {
        setUserInfo(JSON.parse(savedUser));
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowProfilePopup(false);
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("phone_number");
    localStorage.removeItem("role_id");
    localStorage.removeItem("user_id");
    localStorage.removeItem("full_name");
    localStorage.removeItem("address");
    localStorage.removeItem("date_of_birth");
    setUserInfo({ name: "Nguyễn Văn A", email: "user@example.com", phone: "" });
    alert('Đăng xuất thành công!');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.phone || !loginForm.password) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      // Gọi API đăng nhập
      const response = await instance.post('/api/v1/auth/login', {
        phone: loginForm.phone,
        password: loginForm.password
      });

      if (response.data.success) {
        // Lấy thông tin user từ database
        const userData = response.data.user;
        
        setIsLoggedIn(true);
        setUserInfo(userData);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userInfo", JSON.stringify(userData));
        setShowLoginPopup(false);
        setLoginForm({ phone: "", password: "" });
        
        alert('Đăng nhập thành công!');
      } else {
        alert(response.data.message || 'Đăng nhập thất bại!');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <>
      <header className="cps-header">
        <div className="container py-2">
          <div className="row align-items-center justify-content-center g-2 flex-nowrap text-center">
            {/* Danh mục */}
            <div className="col-auto d-flex align-items-center">
              <div className="cps-btn-red-light position-relative">
                <button
                  className="header-btn d-flex align-items-center gap-2"
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  style={{minWidth: 90}}
                >
                  <FaBars className="cps-icon" /> Danh mục
                </button>
                {isDropdownOpen && (
                  <ul className="cps-dropdown-menu">
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        onClick={() => {
                          // Đóng dropdown ngay lập tức
                          setIsDropdownOpen(false);
                          // Gọi hàm onCategoryChange để cập nhật selectedCategory trong App.tsx
                          onCategoryChange(category.id);
                          // Navigate đến trang products với category ID
                          navigate(`/products?category=${category.id}`);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Thanh tìm kiếm */}
            <div className="col d-flex align-items-center justify-content-center">
              <div className="input-group cps-search-group" style={{maxWidth: 500, minWidth: 200}}>
                <span className="input-group-text bg-white border-end-0 cps-search-icon" id="search-addon">
                  <FaSearch className="cps-icon text-secondary" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 cps-search-input"
                  placeholder="Bạn cần tìm gì?"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Tìm kiếm"
                  aria-describedby="search-addon"
                  style={{borderRadius: '0 16px 16px 0'}}
                />
              </div>
            </div>
            {/* Gọi mua hàng */}
            <div className="col-auto d-flex align-items-center">
              <div className="cps-header-action text-white">
                <FaPhoneAlt className="cps-icon me-1" />
                <div>
                  <span className="fw-normal">Gọi mua hàng</span>
                  <br />
                  <span className="fw-bold ms-1">1800.1800</span>
                </div>
              </div>
            </div>
            {/* Tra cứu đơn hàng */}
            <div className="col-auto d-flex align-items-center">
              <div 
                className="cps-header-action text-white"
                onClick={() => handleActionClick('order')}
                style={{cursor: 'pointer'}}
              >
                <FaTruck className="cps-icon me-1" />
                <div>
                <span >Tra cứu</span>
                <br />
                <span> đơn hàng</span>
                </div>
              </div>
            </div>
            
            {/* Đăng nhập hoặc Profile */}
            <div className="col-auto d-flex align-items-center position-relative">
              <div className="cps-btn-red-light">
                {isLoggedIn ? (
                  <button
                    className="header-btn d-flex align-items-center gap-2"
                    onClick={() => handleActionClick('profile')}
                  >
                    <FaUser className="cps-icon" />
                  </button>
                ) : (
                  <button
                    className="header-btn d-flex align-items-center gap-2"
                    onClick={() => handleActionClick('login')}
                  >
                    <FaUser className="cps-icon" /> Đăng nhập
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="login-popup-overlay" onClick={() => setShowLoginPopup(false)}>
          <div className="login-popup" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowLoginPopup(false)}>
              <FaTimes />
            </button>
            <div className="login-popup-content">
              <h3 className="smember-title">Đăng nhập</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})}
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    Đăng nhập
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => setShowLoginPopup(false)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Overlay để click ra ngoài sẽ đóng dropdown */}
      {isDropdownOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999
          }}
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      {/* Profile Popup */}
      {showProfilePopup && (
        <div className="profile-popup-overlay" onClick={() => setShowProfilePopup(false)}>
          <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
            <div className="profile-popup-header">
              <h3>Thông tin tài khoản</h3>
              <button 
                className="profile-popup-close"
                onClick={() => setShowProfilePopup(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="profile-popup-content">
              <div className="profile-popup-avatar">
                <FaUser className="profile-popup-avatar-icon" />
              </div>
              <div className="profile-popup-info">
                <div className="profile-popup-name">{userInfo.name}</div>
                <div className="profile-popup-phone">{userInfo.phone}</div>
                {userInfo.address && (
                  <div className="profile-popup-address">{userInfo.address}</div>
                )}
                {userInfo.dateOfBirth && (
                  <div className="profile-popup-birth">Ngày sinh: {userInfo.dateOfBirth}</div>
                )}
              </div>
              <div className="profile-popup-actions">
                <button className="profile-popup-btn logout-btn" onClick={handleLogout}>
                  <FaTimes />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
