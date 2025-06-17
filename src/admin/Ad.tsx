import React, { useEffect, useState } from "react";
import "./css.css";
import instance from "../axios";

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

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

interface Product {
  name: string;
  thumbnail: string;
  price: number;
  description: string;
  category_id: number;
  brand_id: number;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"orders" | "add" | "delete">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | string>("");

  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    thumbnail: "",
    price: 0,
    description: "",
    category_id: 0,
    brand_id: 0,
  });

  useEffect(() => {
    fetchOrders();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await instance.get<Order[]>("/api/v1/orders");
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await instance.get<Category[]>("/api/v1/categories/getAll");
      setCategories(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data } = await instance.get<Brand[]>("/api/v1/brands");
      setBrands(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách brands:", error);
    }
  };

  const updateOrderStatus = async (id: number, newStatus: string) => {
    try {
      await instance.patch(`/api/v1/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
    setNewProduct({ ...newProduct, category_id: parseInt(event.target.value) });
  };

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewProduct({ ...newProduct, brand_id: parseInt(event.target.value) });
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      await instance.patch(`/api/v1/orders/${id}/status`, { status: "cancelled" });
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    if (status === "") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
  };

  const translateStatus = (status: string): string => {
    switch (status) {
      case "pending": return "Chờ xử lý";
      case "processing": return "Đang xử lý";
      case "shipped": return "Đã gửi";
      case "delivered": return "Đã giao";
      case "cancelled": return "Đã hủy";
      default: return status;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: name === "price" ? Number(value) : value });
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        name: newProduct.name,
        thumbnail: newProduct.thumbnail,
        price: newProduct.price,
        description: newProduct.description,
        brand_id: newProduct.brand_id,
        category_id: newProduct.category_id,
      };
      await instance.post("/api/v1/products", productData);
      alert("Sản phẩm đã được thêm thành công!");
      setNewProduct({ name: "", thumbnail: "", price: 0, description: "", category_id: 0, brand_id: 0 });
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="sidebar">
        <button onClick={() => setActiveTab("orders")}>📦 Quản lý đơn hàng</button>
        <button onClick={() => setActiveTab("add")}>➕ Thêm sản phẩm</button>
      </div>
      <div className="content">
        {activeTab === "orders" && (
          <>
            <div className="status-filters">
              <button onClick={() => handleStatusFilter("pending")}>Chờ xử lý</button>
              <button onClick={() => handleStatusFilter("processing")}>Đang xử lý</button>
              <button onClick={() => handleStatusFilter("shipped")}>Đã gửi</button>
              <button onClick={() => handleStatusFilter("delivered")}>Đã giao</button>
              <button onClick={() => handleStatusFilter("cancelled")}>Đã hủy</button>
              <button onClick={() => handleStatusFilter("")}>Tất cả</button>
            </div>
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
                      style={{ opacity: order.status === "delivered" || order.status === "cancelled" ? 0.5 : 1 }}
                    >
                      <td>{order.id}</td>
                      <td>{order.fullname}</td>
                      <td>{order.phoneNumber}</td>
                      <td>{order.address}</td>
                      <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Chưa đặt"}</td>
                      <td>{translateStatus(order.status)}</td>
                      <td>{order.totalMoney?.toLocaleString()} đ</td>
                      <td>
                        {order.status === "pending" && (
                          <button onClick={() => updateOrderStatus(order.id, "processing")}>🔄 Xử lý</button>
                        )}
                        {order.status === "processing" && (
                          <button onClick={() => updateOrderStatus(order.id, "shipped")}>🚚 Gửi hàng</button>
                        )}
                        {order.status === "shipped" && (
                          <button onClick={() => updateOrderStatus(order.id, "delivered")}>✅ Giao hàng</button>
                        )}
                        {order.status !== "cancelled" && order.status !== "delivered" && (
                          <button onClick={() => handleDeleteOrder(order.id)}>❌ Hủy đơn</button>
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
            <input name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Tên sản phẩm" />
            <input name="price" type="text" value={newProduct.price} onChange={handleInputChange} placeholder="Giá" />
            <textarea name="thumbnail" value={newProduct.thumbnail} onChange={handleInputChange} placeholder="URL hình thu nhỏ" />
            <textarea name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Mô tả sản phẩm" />
            <select value={newProduct.brand_id} onChange={handleBrandChange}>
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <button onClick={handleAddProduct}>Thêm sản phẩm</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
