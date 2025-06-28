import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="cps-footer">
      <div className="container">
        <div className="row g-4">
          {/* Thông tin liên hệ */}
          <div className="col-md-4">
            <h5 className="footer-title">Công ty TNHH Thương Mại và Dịch Vụ Kỹ Thuật TVT TECH</h5>
            <p className="footer-desc">
              Chuyên cung cấp các sản phẩm công nghệ chính hãng với giá tốt nhất.
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>1800.1800</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>contact@tvttech.com</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Chiến Thắng,Thanh Trì,Hà Nội</span>
              </div>
            </div>
          </div>

          {/* Links nhanh */}
          <div className="col-md-2">
            <h6 className="footer-subtitle">Liên kết nhanh</h6>
            <ul className="footer-links">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/products">Sản phẩm</Link></li>
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div className="col-md-2">
            <h6 className="footer-subtitle">Hỗ trợ</h6>
            <ul className="footer-links">
              <li><Link to="/faq">Hỏi đáp</Link></li>
              <li><Link to="/shipping">Vận chuyển</Link></li>
              <li><Link to="/warranty">Bảo hành</Link></li>
              <li><Link to="/return">Đổi trả</Link></li>
            </ul>
          </div>

          {/* Mạng xã hội */}
          <div className="col-md-4">
            <h6 className="footer-subtitle">Theo dõi chúng tôi</h6>
            <div className="social-links">
              <a href="#" className="social-link">
                <FaFacebook />
              </a>
              <a href="#" className="social-link">
                <FaYoutube />
              </a>
              <a href="#" className="social-link">
                <FaInstagram />
              </a>
            </div>
            <div className="newsletter">
              <h6 className="footer-subtitle">Đăng ký nhận tin</h6>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Email của bạn" 
                  className="newsletter-input"
                />
                <button className="newsletter-btn">Đăng ký</button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright">
                © 2024 TVT Tech. Tất cả quyền được bảo lưu.
              </p>
            </div>
            <div className="col-md-6 text-end">
              <div className="payment-methods">
                <span className="payment-text">Chấp nhận thanh toán:</span>
                <div className="payment-icons">
                  <span className="payment-icon">💳</span>
                  <span className="payment-icon">🏦</span>
                  <span className="payment-icon">📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 