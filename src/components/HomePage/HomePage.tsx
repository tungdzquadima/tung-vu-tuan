import "./HomePage.css";
import { FaMobileAlt, FaLaptop, FaTabletAlt, FaHeadphones, FaRegClock, FaGift, FaBolt, FaNewspaper, FaShieldAlt, FaExchangeAlt, FaTruck, FaMedal, FaHeadset } from "react-icons/fa";
import "../Header/Header.css";
import Footer from "../Footer/Footer";
import { useState, useEffect } from "react";
import instance from "../../axios";
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: <FaMobileAlt />, name: "Điện thoại" },
  { icon: <FaLaptop />, name: "Laptop" },
  { icon: <FaTabletAlt />, name: "Tablet" },
  { icon: <FaHeadphones />, name: "Tai nghe" },
  { icon: <FaRegClock />, name: "Đồng hồ" },
];
const commitments = [
  {
    icon: <FaShieldAlt size={32} color="#ff4d4f" />, 
    title: "Thương hiệu đảm bảo",
    desc: "Nhập khẩu, bảo hành chính hãng"
  },
  {
    icon: <FaExchangeAlt size={32} color="#ff4d4f" />,
    title: "Đổi trả dễ dàng",
    desc: "Theo chính sách đổi trả tại FPT Shop"
  },
  {
    icon: <FaTruck size={32} color="#ff4d4f" />,
    title: "Giao hàng tận nơi",
    desc: "Tại 63 tỉnh thành"
  },
  {
    icon: <FaMedal size={32} color="#ff4d4f" />,
    title: "Sản phẩm chất lượng",
    desc: "Đảm bảo tương thích và độ bền cao"
  }
];

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();
  
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Chào mừng đến với TVT TECH",
      subtitle: "Mua sắm công nghệ chính hãng, giá tốt mỗi ngày!"
    },
    {
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Laptop Gaming Cao Cấp",
      subtitle: "Trải nghiệm game mượt mà với hiệu năng đỉnh cao"
    },
    {
      image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
      title: "Điện Thoại Thông Minh",
      subtitle: "Công nghệ tiên tiến, thiết kế hiện đại"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleBuyNow = (product: any) => {
    navigate(`/product-detail/${product.id}`);
  };

  useEffect(() => {
    async function fetchFeaturedByCategory() {
      try {
        const catRes = await instance.get('/api/v1/categories/getAll');
        const categories = catRes.data;
        const result = [];
        for (const cat of categories) {
          const prodRes = await instance.get(`/api/v1/products/category/${cat.id}`, { params: { page: 0, limit: 4 } });
          if (prodRes.data.products && prodRes.data.products.length > 0) {
            result.push({
              category: cat,
              products: prodRes.data.products
            });
          }
        }
        setCategoryProducts(result);
      } catch (err) {
        setCategoryProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchFeaturedByCategory();
  }, []);

  return (
    <div className="cps-home">
      {/* Slider Banner */}
      <div className="cps-home-slider position-relative mb-4">
        <div className="slider-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slider-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="slider-content d-flex align-items-center justify-content-center text-white">
                <div className="text-center">
                  <h1 className="fw-bold mb-2">{slide.title}</h1>
                  <p className="fs-4">{slide.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <button className="slider-btn slider-btn-prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="slider-btn slider-btn-next" onClick={nextSlide}>
          &#10095;
        </button>
        
        {/* Dots Indicator */}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
      {/* Danh mục */}
      <div className="cps-home-section mb-4">
        <h2 className="cps-home-title">Danh mục nổi bật</h2>
        <div className="row g-3 justify-content-center">
          {categories.map((cat) => (
            <div className="col-6 col-sm-4 col-md-2" key={cat.name}>
              <div className="cps-home-cat-card d-flex flex-column align-items-center justify-content-center">
                <span className="cps-home-cat-icon mb-2">{cat.icon}</span>
                <span className="cps-home-cat-name">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Sản phẩm nổi bật */}
      <div className="cps-home-section mb-4">
        <h2 className="cps-home-title">Sản phẩm nổi bật</h2>
        {loadingProducts ? (
          <div className="text-center py-4">Đang tải sản phẩm...</div>
        ) : (
          categoryProducts.length === 0 ? (
            <div className="text-center py-4">Không có sản phẩm nổi bật.</div>
          ) : (
            categoryProducts.map(({ category, products }) => (
              <div className="mb-4" key={category.id}>
                <h5 className="mb-3" style={{color: '#e60004', fontWeight: 600}}>{category.name}</h5>
                <div className="row g-3 justify-content-center">
                  {products.map((product: any) => (
                    <div className="col-6 col-md-3" key={product.id}>
                      <div className="cps-home-prod-card card h-100 text-center">
                        <img src={product.thumbnail} alt={product.name} className="card-img-top cps-home-prod-img" />
                        <div className="card-body">
                          <h5 className="card-title cps-home-prod-name">{product.name}</h5>
                          <p className="card-text cps-home-prod-price fw-bold text-danger">{product.price.toLocaleString()}₫</p>
                          <button 
                            className="btn btn-danger rounded-pill px-4"
                            onClick={() => handleBuyNow(product)}
                          >
                            Mua ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )
        )}
      </div>
      {/* Dải cam kết dịch vụ */}
      <div className="cps-home-commitments-section mb-4" style={{background: '#f6f7f9', padding: '40px 0'}}>
        <div className="container">
          <div className="row justify-content-center align-items-center text-center">
            {commitments.map((item, idx) => (
              <div className="col-12 col-sm-6 col-md-3 mb-4 mb-md-0" key={idx}>
                <div className="cps-home-commitment-item d-flex flex-column align-items-center">
                  <div className="cps-home-commitment-icon mb-3" style={{background: '#fff', borderRadius: '16px', padding: '18px', display: 'inline-flex', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
                    {item.icon}
                  </div>
                  <div className="cps-home-commitment-title fw-bold" style={{fontSize: '1.1rem'}}>{item.title}</div>
                  <div className="cps-home-commitment-desc text-secondary" style={{fontSize: '0.98rem'}}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default HomePage;
