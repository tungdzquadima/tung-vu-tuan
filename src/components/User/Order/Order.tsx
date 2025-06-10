import React, { useEffect, useState } from "react";
import instance from "../../../axios"; // axios instance đã config baseURL
import { useNavigate } from "react-router-dom";

interface OrderDetail {
  id: number;
  color: string;
  order_id: number;
  product_id: number;
  price: number;
  number_of_products: number;
  total_money: number;
}

interface Order {
  id: number;
  fullname: string;
  email: string;
  phoneNumber: string;
  address: string;
  orderDate: string;
  status: string; // Trạng thái đơn hàng
  totalMoney: number;
  shippingAddress: string;
  shippingMethod: string;
  shippingDate: string;
  trackingNumber: string;
  paymentMethod: string;
}

function Order() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]); // State lưu trữ danh sách đơn hàng
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái để kiểm tra quá trình tải dữ liệu
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Để lưu trữ đơn hàng đang được chọn
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]); // Chi tiết sản phẩm trong đơn hàng
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false); // Trạng thái tải chi tiết sản phẩm

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Lấy user_id từ localStorage
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          alert("Vui lòng đăng nhập!");
          navigate("/login"); // Điều hướng đến trang login nếu không có user_id
          return;
        }

        // Gọi API để lấy đơn hàng của người dùng
        const response = await instance.get(`/api/v1/orders/user/${userId}`);
        setOrders(response.data || []); // Đảm bảo rằng orders là mảng
        setLoading(false); // Dữ liệu đã được tải xong
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
        setLoading(false);
        alert("Đã xảy ra lỗi khi lấy danh sách đơn hàng.");
      }
    }

    fetchOrders();
  }, [navigate]);

  // Gọi API để lấy chi tiết đơn hàng khi người dùng click vào đơn hàng
  const handleOrderClick = async (order: Order) => {
    if (selectedOrder?.id === order.id) {
      // Nếu đơn hàng đã được chọn, bỏ chọn
      setSelectedOrder(null);
      setOrderDetails([]); // Xóa chi tiết sản phẩm khi bỏ chọn
    } else {
      // Nếu đơn hàng chưa được chọn, gọi API lấy chi tiết
      setSelectedOrder(order);
      setLoadingDetails(true); // Đánh dấu đang tải chi tiết

      try {
        const response = await instance.get(`/api/v1/order_details/order/${order.id}`);
        setOrderDetails(response.data || []); // Lưu chi tiết sản phẩm vào state
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        alert("Đã xảy ra lỗi khi lấy chi tiết sản phẩm.");
      } finally {
        setLoadingDetails(false); // Kết thúc quá trình tải chi tiết
      }
    }
  };

  // Nếu đang tải dữ liệu, hiển thị loading
  if (loading) {
    return <div>Đang tải đơn hàng...</div>;
  }

  // Nếu không có đơn hàng, hiển thị thông báo
  if (orders.length === 0) {
    return <div>Chưa có đơn hàng nào.</div>;
  }

  return (
    <div>
      <h2>Danh sách đơn hàng</h2>
      <table>
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Ngày đặt hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Phương thức thanh toán</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => handleOrderClick(order)}
              style={{ cursor: "pointer" }}
            >
              <td>{order.id}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{order.totalMoney.toLocaleString()} VND</td>
              <td>{order.status === 'delivered' ? 'Đã giao' : 'Chờ xử lý'}</td>
              <td>{order.paymentMethod}</td>
              <td>Chi tiết</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
          <p><strong>Họ tên:</strong> {selectedOrder.fullname}</p>
          <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress}</p>
          <p><strong>Ngày giao hàng:</strong> {new Date(selectedOrder.shippingDate).toLocaleDateString()}</p>
          <p><strong>Phương thức giao hàng:</strong> {selectedOrder.shippingMethod}</p>
          <p><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>

          <h4>Chi tiết sản phẩm:</h4>
          {loadingDetails ? (
            <div>Đang tải chi tiết sản phẩm...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Số lượng</th>
                  <th>Màu sắc</th>
                  <th>Đơn giá</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.length > 0 ? (
                  orderDetails.map((detail) => (
                    <tr key={detail.id}>
                      <td>{detail.number_of_products}</td>
                      <td>{detail.color}</td>
                      <td>{detail.price.toLocaleString()} VND</td>
                      <td>{detail.total_money.toLocaleString()} VND</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>Không có chi tiết sản phẩm cho đơn hàng này.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Order;
