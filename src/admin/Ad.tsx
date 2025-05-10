import React, { useEffect, useState } from "react";
import instance from "../axios";
import "./css.css";

interface Order {
  id: string;
  fullname: string;
  user: string | null;
  product: string;
  quantity: number;
  address: string;
  status?: string;
}

interface Product {
  id: string;
  images: string[];
  title: string;
  brand: string;
  price: number;
  rating: number;
  stock: number;
  discountPercentage: number; // giảm giá phần trăm
}

const Ad: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "add" | "delete">(
    "orders"
  );

  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    images: [""],
    title: "",
    brand: "",
    price: 0,
    rating: 0,
    stock: 0,
    discountPercentage: 0,
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await instance.get("/order");
      setOrders(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await instance.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) return;
    try {
      await instance.delete(`/order/${id}`);
      setOrders(orders.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  const handleDelivered = async (id: string) => {
    try {
      await instance.patch(`/order/${id}`, { status: "delivered" });
      setOrders(
        orders.map((order) =>
          order.id === id ? { ...order, status: "delivered" } : order
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await instance.post("/products", newProduct);
      alert("Thêm sản phẩm thành công!");
      fetchProducts();
      setNewProduct({
        id: "",
        images: [""],
        title: "",
        brand: "",
        price: 0,
        rating: 0,
        stock: 0,
        discountPercentage: 0,
      });
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
    try {
      await instance.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="sidebar">
        <button onClick={() => setActiveTab("orders")}>
          📦 Quản lý đơn hàng
        </button>
        <button onClick={() => setActiveTab("add")}>➕ Thêm sản phẩm</button>
        <button onClick={() => setActiveTab("delete")}>🗑️ Xóa sản phẩm</button>
      </div>

      <div className="content">
        {activeTab === "orders" && (
          <>
            <h1>📦 Quản lý Đơn hàng</h1>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>User</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Địa chỉ</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.fullname}</td>
                    <td>{order.user ?? "Khách"}</td>
                    <td>{order.product}</td>
                    <td>{order.quantity}</td>
                    <td>{order.address}</td>
                    <td>
                      <span
                        className={`status-tag ${
                          order.status === "delivered"
                            ? "status-delivered"
                            : "status-pending"
                        }`}
                      >
                        {order.status === "delivered"
                          ? "Đã giao"
                          : "Đang xử lý"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-button delete-btn"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        ❌ Xóa
                      </button>
                      {order.status !== "delivered" && (
                        <button
                          className="action-button delivered-btn"
                          onClick={() => handleDelivered(order.id)}
                        >
                          ✅ Giao hàng
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "add" && (
          <div className="form-add">
            <h2>➕ Thêm sản phẩm</h2>
            {[
              "id",
              "images",
              "title",
              "brand",
              "price",
              "rating",
              "stock",
              "discountPercentage",
            ].map((field) => (
              <div key={field}>
                <label>
                  {field}{" "}
                  {field === "discountPercentage" && "(Giảm giá phần trăm)"}
                </label>

                {field === "images" ? (
                  <textarea
                    placeholder='Nhập các URL ảnh, cách nhau bởi dấu phẩy ("|")'
                    value={
                      Array.isArray(newProduct.images)
                        ? newProduct.images.join("| ")
                        : newProduct.images
                    }
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        images: e.target.value
                          .split("|")
                          .map((url) => url.trim()),
                      })
                    }
                  />
                ) : (
                  <input
                    type={
                      field === "price" ||
                      field === "rating" ||
                      field === "stock" ||
                      field === "discountPercentage"
                        ? "number"
                        : "text"
                    }
                    value={(newProduct as any)[field]}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        [field]:
                          field === "price" ||
                          field === "rating" ||
                          field === "stock" ||
                          field === "discountPercentage"
                            ? Number(e.target.value)
                            : e.target.value,
                      })
                    }
                  />
                )}
              </div>
            ))}

            <button onClick={handleAddProduct}>Thêm sản phẩm</button>
          </div>
        )}

        {activeTab === "delete" && (
          <div>
            <h2>🗑️ Danh sách sản phẩm</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Thương hiệu</th>
                  <th>Giá</th>
                  <th>Rating</th>
                  <th>Kho</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <img
                        src={p.images[0]}
                        alt="img"
                        style={{ width: "50px" }}
                      />
                    </td>
                    <td>{p.title}</td>
                    <td>{p.brand}</td>
                    <td>{p.price}</td>
                    <td>{p.rating}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button
                        className="action-button delete-btn"
                        onClick={() => handleDeleteProduct(p.id)}
                      >
                        ❌ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ad;
