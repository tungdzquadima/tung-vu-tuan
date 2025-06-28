import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../../axios";

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  thumbnail: string;
  category_id: Category;
  brand_id: Brand;
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showOrderForm, setShowOrderForm] = useState<boolean>(false);
  const [orderDetailsForm, setOrderDetailsForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState({
    fullname: "",
    email: "",
    phone_number: "",
    address: "",
    note: "",
    shipping_method: "GHN",
    shipping_address: "",
    tracking_number: "",
    payment_method: "tiền mặt",
  });

  const [orderDetail, setOrderDetail] = useState({
    order_id: 0,
    product_id: 0,
    price: 0,
    number_of_products: 0,
    total_money: 0,
    color: "#ff00ff",
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await instance.get(`/api/v1/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.log("Error fetching product details:", error);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!product) {
      alert("Sản phẩm không hợp lệ");
      return;
    }

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Vui lòng đăng nhập!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Tạo đơn hàng
      const orderResponse = await instance.post("/api/v1/orders", {
        user_id: userId,
        fullname: userInfo.fullname,
        email: userInfo.email,
        phone_number: userInfo.phone_number,
        address: userInfo.address,
        note: userInfo.note,
        total_money: product.price * quantity,
        shipping_method: userInfo.shipping_method,
        shipping_address: userInfo.shipping_address,
        tracking_number: userInfo.tracking_number,
        payment_method: userInfo.payment_method,
      });

      const orderId = orderResponse.data.id;

      // Tạo chi tiết đơn hàng
      await instance.post("/api/v1/order_details", {
        order_id: orderId,
        product_id: product.id,
        price: product.price * quantity,
        number_of_products: quantity,
        total_money: product.price * quantity,
        color: orderDetail.color,
      });

      setShowSuccessPopup(true);
      setShowOrderForm(false);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 1 && product) {
      setQuantity(newQuantity);
      setOrderDetail((prevState) => ({
        ...prevState,
        number_of_products: newQuantity,
        total_money: product.price * newQuantity,
      }));
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate("/products");
  };

  if (!product) {
    return <div style={{ padding: "20px", textAlign: "left" }}>Loading product details...</div>;
  }

  return (
    <div>
      {/* Card sản phẩm */}
      <div className="product-detail">
        <div className="product-info" style={{ display: 'flex', gap: 40 }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: 1,
            minWidth: 0
          }}>
            <img src={product.thumbnail} alt={product.name} style={{ maxWidth: 340, width: '100%' }} />
            
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 2,
            minWidth: 0
          }}>
            <div className="product-details">
              <h2>{product.name}</h2>
              <div className="price">{product.price.toLocaleString()}₫</div>
              <div className="brand-cat">
                <span>Danh mục: {product.category_id?.name || 'Loading...'} | </span>
                <span>Thương hiệu: {product.brand_id?.name || 'Loading...'}</span>
              </div>
              <div className="desc">{product.description}</div>  
              <button
              className="buy-now-btn"
              style={{ marginBottom: 0, width: '90%' }}
              onClick={() => setShowOrderForm(true)}
            >
              Mua ngay
            </button>           
            </div>
            
          </div>
          
        </div>
        
      </div>
      {/* Form đặt hàng nằm ngay bên dưới card */}
      {showOrderForm && (
        <form onSubmit={handleOrderSubmit} className="order-form" style={{ margin: '32px auto 0 auto', maxWidth: 500 }}>
          <h3>Thông tin đặt hàng</h3>
          <div className="order-form-row">
            <label>Họ tên:</label>
            <input
              type="text"
              value={userInfo.fullname}
              onChange={(e) => setUserInfo({ ...userInfo, fullname: e.target.value })}
              required
            />
          </div>
          <div className="order-form-row">
            <label>Email:</label>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              required
            />
          </div>
          <div className="order-form-row">
            <label>Số điện thoại:</label>
            <input
              type="text"
              value={userInfo.phone_number}
              onChange={(e) => setUserInfo({ ...userInfo, phone_number: e.target.value })}
              required
            />
          </div>
          <div className="order-form-row">
            <label>Địa chỉ giao hàng:</label>
            <input
              type="text"
              value={userInfo.address}
              onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
              required
            />
          </div>
          <div className="order-form-row">
            <label>Ghi chú:</label>
            <textarea
              value={userInfo.note}
              onChange={(e) => setUserInfo({ ...userInfo, note: e.target.value })}
            />
          </div>
          <div className="order-form-row">
            <label>Số lượng:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
          <div className="order-form-row">
            <label>Màu sắc:</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="radio"
                  name="color"
                  value="black"
                  checked={orderDetail.color === 'black'}
                  onChange={() => setOrderDetail({ ...orderDetail, color: 'black' })}
                />
                Đen
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="radio"
                  name="color"
                  value="white"
                  checked={orderDetail.color === 'white'}
                  onChange={() => setOrderDetail({ ...orderDetail, color: 'white' })}
                />
                Trắng
              </label>
            </div>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang đặt hàng..." : "Xác nhận đặt hàng"}
          </button>
        </form>
      )}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">✅</div>
            <h3>Đặt hàng thành công!</h3>
            <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
            <button onClick={closeSuccessPopup} className="success-btn">
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
