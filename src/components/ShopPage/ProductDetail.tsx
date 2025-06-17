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
      setOrderDetailsForm(true);
      setOrderDetail({
        ...orderDetail,
        order_id: orderId,
        product_id: product.id,
        price: product.price * quantity,
        number_of_products: quantity,
        total_money: product.price * quantity,
      });
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrderDetailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await instance.post("/api/v1/order_details", {
        order_id: orderDetail.order_id,
        product_id: orderDetail.product_id,
        price: orderDetail.price,
        number_of_products: orderDetail.number_of_products,
        total_money: orderDetail.total_money,
        color: orderDetail.color,
      });

      alert("Đặt hàng thành công!");
      navigate("/products"); // Điều hướng về trang product
    } catch (error) {
      console.error("Lỗi khi tạo chi tiết đơn hàng:", error);
      alert("Đã xảy ra lỗi khi tạo chi tiết đơn hàng.");
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

  if (!product) {
    return <div style={{ padding: "20px", textAlign: "left" }}>Loading product details...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto", textAlign: "left" }}>
      <div className="product-info" style={{ marginBottom: "20px" }}>
        <img src={product.thumbnail} alt={product.name} style={{ width: "100%", maxWidth: "300px" }} />
        <h2>{product.name}</h2>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Category:</strong> {product.category_id?.name || 'Loading...'}</p>
        <p><strong>Brand:</strong> {product.brand_id?.name || 'Loading...'}</p>
      </div>

      {showOrderForm && (
        <form onSubmit={handleOrderSubmit} className="order-form" style={{ marginBottom: "30px" }}>
          <h3>Thông tin đặt hàng</h3>
          <label>Họ tên:</label>
          <input
            type="text"
            value={userInfo.fullname}
            onChange={(e) => setUserInfo({ ...userInfo, fullname: e.target.value })}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <label>Email:</label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <label>Số điện thoại:</label>
          <input
            type="text"
            value={userInfo.phone_number}
            onChange={(e) => setUserInfo({ ...userInfo, phone_number: e.target.value })}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <label>Địa chỉ giao hàng:</label>
          <input
            type="text"
            value={userInfo.address}
            onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <label>Ghi chú:</label>
          <textarea
            value={userInfo.note}
            onChange={(e) => setUserInfo({ ...userInfo, note: e.target.value })}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button type="submit" disabled={isSubmitting} style={{ padding: "10px 20px" }}>
            {isSubmitting ? "Đang tạo..." : "Tạo đơn hàng"}
          </button>
        </form>
      )}

      {orderDetailsForm && (
        <form onSubmit={handleOrderDetailSubmit} className="order-detail-form">
          <h3>Thông tin chi tiết đơn hàng</h3>
          <label>Số lượng:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <label>Màu sắc:</label>
          <input
            type="color"
            value={orderDetail.color}
            onChange={(e) => setOrderDetail({ ...orderDetail, color: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
          <br />
          <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>
            Gửi đơn hàng
          </button>
        </form>
      )}

      {!showOrderForm && (
        <button onClick={() => setShowOrderForm(true)} style={{ padding: "10px 20px" }}>
          Mua ngay
        </button>
      )}
    </div>
  );
}

export default ProductDetail;
