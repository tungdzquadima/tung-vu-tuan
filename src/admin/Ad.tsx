import React, { useEffect, useState } from "react";
import "./css.css";
import instance from "../axios";

interface Order {
  id: number;
  fullname: string;
  phoneNumber: string;
  address: string;
  orderDate: string | null;
  status: string;
  totalMoney: number;
  paymentMethod?: string;
  shippingMethod?: string;
  trackingNumber?: string;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"orders" | "add" | "delete">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await instance.get<Order[]>("/api/v1/orders");
      setOrders(data);
      setFilteredOrders(data); // Hiển thị tất cả đơn hàng ban đầu
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
    }
  };

  const handleCompleteOrder = async (id: number) => {
    try {
      await instance.patch(`/api/v1/orders/${id}/status`, { status: "delivered" });
      fetchOrders(); // Fetch lại tất cả đơn hàng sau khi cập nhật
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      await instance.patch(`/api/v1/orders/${id}/status`, { status: "cancelled" });
      fetchOrders(); // Fetch lại tất cả đơn hàng sau khi hủy
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    if (status === "") {
      setFilteredOrders(orders); // Nếu không có trạng thái lọc, hiển thị tất cả đơn hàng
    } else {
      setFilteredOrders(orders.filter((order) => order.status === status)); // Lọc theo trạng thái
    }
  };

  const translateStatus = (status: string): string => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đã gửi";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="sidebar">
        <button onClick={() => setActiveTab("orders")}>📦 Quản lý đơn hàng</button>
        <button onClick={() => setActiveTab("add")}>➕ Thêm sản phẩm</button>
        <button onClick={() => setActiveTab("delete")}>🗑️ Xóa sản phẩm</button>
      </div>

      <div className="content">
        {/* Thêm 3 nút lọc trạng thái */}
        <div className="status-filters">
          <button onClick={() => handleStatusFilter("pending")}>Chờ xử lý</button>
          <button onClick={() => handleStatusFilter("cancelled")}>Đã hủy</button>
          <button onClick={() => handleStatusFilter("delivered")}>Đã hoàn thành</button>
          <button onClick={() => handleStatusFilter("")}>Tất cả</button> {/* Hiển thị tất cả đơn hàng */}
        </div>

        {activeTab === "orders" && (
          <>
            <h2>📦 Danh sách Đơn hàng</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Người mua</th>
                  <th>SĐT</th>
                  <th>Địa chỉ</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th>Tổng tiền</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      style={{
                        opacity: order.status === "delivered" || order.status === "cancelled" ? 0.5 : 1,
                      }}
                    >
                      <td>{order.id}</td>
                      <td>{order.fullname}</td>
                      <td>{order.phoneNumber}</td>
                      <td>{order.address}</td>
                      <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Chưa đặt"}</td>
                      <td>{translateStatus(order.status)}</td>
                      <td>{order.totalMoney?.toLocaleString()} đ</td>
                      <td>
                        {order.status !== "delivered" && order.status !== "cancelled" && (
                          <>
                            <button onClick={() => handleCompleteOrder(order.id)}>✅ Hoàn thành</button>
                            <button onClick={() => handleDeleteOrder(order.id)}>🗑️ Xóa</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      Không có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "add" && (
          <div className="form-add">
            <h2>➕ Thêm sản phẩm</h2>
            <input placeholder="Tên sản phẩm" />
            <input type="number" placeholder="Giá" />
            <textarea placeholder="URL ảnh (phân cách bằng dấu ;)" />
            <textarea placeholder="Mô tả" />
            <input placeholder="Category ID" />
            <button>Thêm</button>
          </div>
        )}

        {activeTab === "delete" && (
          <>
            <h2>🗑️ Danh sách Sản phẩm</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {/* Hiển thị sản phẩm nếu có */}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
