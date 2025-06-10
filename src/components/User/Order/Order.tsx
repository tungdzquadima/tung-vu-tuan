import React, { useEffect, useState } from "react";
import instance from "../../../axios";
import { useNavigate } from "react-router-dom";
import "./Order.css"; // Thêm dòng này để import CSS

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
  status: string;
  totalMoney: number;
  shippingAddress: string;
  shippingMethod: string;
  shippingDate: string;
  trackingNumber: string;
  paymentMethod: string;
  active: boolean;
  orderDetails: OrderDetail[];
}

function Order() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchOrdersWithDetails() {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          alert("Vui lòng đăng nhập!");
          navigate("/login");
          return;
        }

        const response = await instance.get(`/api/v1/orders/user/${userId}`);
        const ordersData: Order[] = response.data || [];

        const ordersWithDetails = await Promise.all(
          ordersData.map(async (order) => {
            try {
              const detailRes = await instance.get(`/api/v1/order_details/order/${order.id}`);
              return { ...order, orderDetails: detailRes.data || [] };
            } catch (err) {
              console.error(`Lỗi khi lấy chi tiết đơn hàng ${order.id}:`, err);
              return { ...order, orderDetails: [] };
            }
          })
        );

        setOrders(ordersWithDetails);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
        alert("Đã xảy ra lỗi khi lấy danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrdersWithDetails();
  }, [navigate]);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder((prev) => (prev?.id === order.id ? null : order));
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    try {
      await instance.put(`/api/v1/orders/cancel/${orderId}`);
      alert("Đã hủy đơn hàng thành công.");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled", active: false } : o
        )
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: "cancelled", active: false });
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      alert("Không thể hủy đơn hàng.");
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang chuẩn bị";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  if (loading) return <div className="order-container">Đang tải đơn hàng...</div>;

  return (
    <div className="order-container">
      <h2>Danh sách đơn hàng</h2>

      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>Tất cả</button>
        <button onClick={() => setFilter("pending")}>Chờ xác nhận</button>
        <button onClick={() => setFilter("processing")}>Đang chuẩn bị</button>
        <button onClick={() => setFilter("shipped")}>Đang giao</button>
        <button onClick={() => setFilter("delivered")}>Đã giao</button>
        <button onClick={() => setFilter("cancelled")}>Đã hủy</button>
      </div>

      {filteredOrders.length === 0 ? (
        <p>Không có đơn hàng nào ở trạng thái này.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr onClick={() => handleOrderClick(order)} className="order-row">
                  <td>{order.id}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    {order.orderDetails
                      .reduce((sum, item) => sum + item.total_money, 0)
                      .toLocaleString()} VND
                  </td>
                  <td>{getStatusLabel(order.status)}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    {["pending", "processing"].includes(order.status) && order.active && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelOrder(order.id);
                        }}
                      >
                        Hủy đơn
                      </button>
                    )}
                  </td>
                </tr>
                {selectedOrder?.id === order.id && (
                  <tr>
                    <td colSpan={6}>
                      <div className="order-details">
                        <h3>Chi tiết đơn hàng #{order.id}</h3>
                        <p><strong>Họ tên:</strong> {order.fullname}</p>
                        <p><strong>Số điện thoại:</strong> {order.phoneNumber}</p>
                        <p><strong>Email:</strong> {order.email}</p>
                        <p><strong>Địa chỉ:</strong> {order.address}</p>
                        <p><strong>Địa chỉ giao:</strong> {order.shippingAddress}</p>
                        <p><strong>Ngày giao:</strong> {new Date(order.shippingDate).toLocaleDateString()}</p>
                        <p><strong>Phương thức giao hàng:</strong> {order.shippingMethod}</p>
                        <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>

                        <h4>Chi tiết sản phẩm:</h4>
                        <table className="detail-table">
                          <thead>
                            <tr>
                              <th>Số lượng</th>
                              <th>Màu sắc</th>
                              <th>Đơn giá</th>
                              <th>Tổng tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.orderDetails.length > 0 ? (
                              order.orderDetails.map((detail) => (
                                <tr key={detail.id}>
                                  <td>{detail.number_of_products}</td>
                                  <td>{detail.color}</td>
                                  <td>{detail.price.toLocaleString()} VND</td>
                                  <td>{detail.total_money.toLocaleString()} VND</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4}>Không có chi tiết sản phẩm.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Order;