import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import instance from "../../axios"; // Giả sử bạn sử dụng axios để gọi API

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
  category_id: Category;  // Sử dụng category_id
  brand_id: Brand;  // Sử dụng brand_id
}


function ProductDetail() {
  const { id } = useParams<{ id: string }>(); // Lấy id từ URL
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // Số lượng mua
  const [showOrderForm, setShowOrderForm] = useState<boolean>(false); // Hiển thị form Order
  const [orderDetailsForm, setOrderDetailsForm] = useState<boolean>(false); // Hiển thị form OrderDetail
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    email: "",
    phone_number: "",
    address: "",
    note: "",
    shipping_method: "GHN", // Giả sử chọn GHN
    shipping_address: "",
    tracking_number: "",
    payment_method: "tiền mặt", // Giả sử chọn tiền mặt
  });

  const [orderDetail, setOrderDetail] = useState({
    order_id: 0, // Sẽ được cập nhật sau khi tạo đơn hàng
    product_id: 0,
    price: 0,
    number_of_products: 0,
    total_money: 0,
    color: "#ff00ff", // Màu sắc mặc định
  });

  // Fetch product details when the component mounts
  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await instance.get(`/api/v1/products/${id}`);
        setProduct(data); // Lưu thông tin sản phẩm vào state
      } catch (error) {
        console.log("Error fetching product details:", error);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Handle submit for order (Create order)
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Gửi yêu cầu tạo đơn hàng
    try {
      // Kiểm tra xem sản phẩm có tồn tại hay không
      if (!product) {
        alert("Sản phẩm không hợp lệ");
        return;
      }

      const orderResponse = await instance.post("/api/v1/orders", {
        user_id: 6, // Bạn có thể thay đổi user_id theo yêu cầu
        fullname: userInfo.fullname,
        email: userInfo.email,
        phone_number: userInfo.phone_number,
        address: userInfo.address,
        note: userInfo.note,
        total_money: product?.price * quantity,  // Tổng giá trị đơn hàng
        shipping_method: userInfo.shipping_method,
        shipping_address: userInfo.shipping_address,
        tracking_number: userInfo.tracking_number,
        payment_method: userInfo.payment_method,
      });

      const orderId = orderResponse.data.id;  // Lấy order_id từ phản hồi của API tạo đơn hàng

      // 2. Hiển thị form OrderDetail sau khi đơn hàng được tạo
      setOrderDetailsForm(true);  // Set orderDetailsForm thành true khi tạo đơn hàng thành công

      // Cập nhật orderDetail với các thông tin của sản phẩm và đơn hàng
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
    }
  };

  // Handle submit for order detail (Create order detail)
  const handleOrderDetailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Gửi yêu cầu tạo chi tiết đơn hàng
    console.log("Submitting order detail:", orderDetail);
    
    try {
      const response = await instance.post("/api/v1/order_details", {
        order_id: orderDetail.order_id, // order_id là id của đơn hàng đã tạo
        product_id: orderDetail.product_id,
        price: orderDetail.price,
        number_of_products: orderDetail.number_of_products,
        total_money: orderDetail.total_money,
        color: orderDetail.color,
      });

      alert("Đặt hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo chi tiết đơn hàng:", error);
      alert("Đã xảy ra lỗi khi tạo chi tiết đơn hàng.");
    }
  };

  // Nếu chưa có sản phẩm, hiển thị thông báo tải dữ liệu
  if (!product) {
    return <div>Loading product details...</div>;
  }
   // Đoạn code này đã sửa phần số lượng khi người dùng thay đổi
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 1) {
      setQuantity(newQuantity); // Cập nhật số lượng
      setOrderDetail((prevState) => ({
        ...prevState,
        number_of_products: newQuantity,  // Cập nhật số lượng trong orderDetail
        total_money: product?.price * newQuantity,  // Cập nhật tổng tiền dựa trên số lượng
      }));
    }
  };

  return (
    <div className="product-detail">
      <div className="product-info">
        <img src={product.thumbnail} alt={product.name} />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <p>mô tả: {product.description}</p>
        <p>Category: {product.category_id?.name || 'Loading...'}</p>
        <p>Brand: {product.brand_id?.name || 'Loading...'}</p>
      </div>

      {/* Form Order */}
      {showOrderForm && (
        <form onSubmit={handleOrderSubmit} className="order-form">
          <h3>Enter Your Order Information</h3>
          <div>
            <label htmlFor="fullname">Full Name:</label>
            <input
              type="text"
              id="fullname"
              value={userInfo.fullname}
              onChange={(e) => setUserInfo({ ...userInfo, fullname: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="phone_number">Phone Number:</label>
            <input
              type="text"
              id="phone_number"
              value={userInfo.phone_number}
              onChange={(e) => setUserInfo({ ...userInfo, phone_number: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="address">Shipping Address:</label>
            <input
              type="text"
              id="address"
              value={userInfo.address}
              onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="note">Note:</label>
            <textarea
              id="note"
              value={userInfo.note}
              onChange={(e) => setUserInfo({ ...userInfo, note: e.target.value })}
            />
          </div>
          <button type="submit">Create Order</button>
        </form>
      )}

      {/* Form Order Detail */}
      {orderDetailsForm && (
        <form onSubmit={handleOrderDetailSubmit} className="order-detail-form">
          <h3>Enter Order Detail Information</h3>
          <div>
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
          <div>
            <label htmlFor="color">Product Color:</label>
            <input
              type="color"
              id="color"
              value={orderDetail.color}
              onChange={(e) => setOrderDetail({ ...orderDetail, color: e.target.value })}
            />
          </div>
          <button type="submit">Submit Order Detail</button>
        </form>
      )}

      {/* Button to show Order Form */}
      <button onClick={() => setShowOrderForm(true)}>Buy Now</button>
    </div>
  );
}

export default ProductDetail;
