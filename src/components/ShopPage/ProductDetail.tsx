import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Sử dụng useNavigate thay vì useHistory
import instance from "../../axios"; // Import axios instance
import "./Shoppage.css"; // Cập nhật tên file CSS nếu cần

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  imageUrls: string;
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [order, setOrder] = useState({
    fullname: "",
    email: "",
    phone_number: "",
    address: "",
    note: "",
    total_money: 0,
    shipping_method: "GHN",
    shipping_address: "",
    tracking_number: "",
    payment_method: "tiền mặt",
  });

  const navigate = useNavigate(); // Sử dụng useNavigate()

  // Fetch product data
  const fetchProduct = async () => {
    try {
      const response = await instance.get(`/api/v1/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product) {
        // Calculate total price (assuming only one product)
        const totalMoney = product.price; // Can be extended for multiple items

        // Prepare order data
        const orderData = {
          ...order,
          total_money: totalMoney,
          user_id: 3, // Assuming user_id=3, you can replace it with actual logged-in user ID
        };

        // POST request to create order
        const response = await instance.post("http://localhost:8088/api/v1/orders", orderData);
        console.log("Order placed successfully:", response.data);

        // Redirect to the success page after order is placed
        navigate("/success"); // Dùng navigate thay vì push
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail-page">
      <div className="product-info">
        <h1>{product.name}</h1>
        <img src={product.thumbnail || "/default-image.png"} alt={product.name} />
        <p>{product.description}</p>
        <p className="price">${product.price.toLocaleString()}</p>
      </div>

      <div className="order-form">
        <h2>Nhập thông tin để đặt hàng</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullname">Họ tên</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={order.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={order.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Số điện thoại</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={order.phone_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <input
              type="text"
              id="address"
              name="address"
              value={order.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="note">Ghi chú</label>
            <textarea
              id="note"
              name="note"
              value={order.note}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="shipping_address">Địa chỉ giao hàng</label>
            <input
              type="text"
              id="shipping_address"
              name="shipping_address"
              value={order.shipping_address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="payment_method">Phương thức thanh toán</label>
            <select
              id="payment_method"
              name="payment_method"
              value={order.payment_method}
              onChange={handleChange}
            >
              <option value="tiền mặt">Tiền mặt</option>
              <option value="online">Thanh toán trực tuyến</option>
            </select>
          </div>

          <button type="submit" className="order-button">Đặt hàng</button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetail;
