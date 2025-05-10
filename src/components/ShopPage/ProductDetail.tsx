import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../../axios";
import "./css.css";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Giả lập trạng thái đăng nhập
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    fullname?: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get<Product>(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    })();

    (async () => {
      try {
        const { data } = await instance.get<Product[]>("/products");
        const shuffledProducts = data.sort(() => Math.random() - 0.5);
        setSuggestedProducts(shuffledProducts.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    })();

    // Kiểm tra đăng nhập (ví dụ: kiểm tra localStorage token)
    // const token = localStorage.getItem("token");
    // setIsLoggedIn(!!token);
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedName = localStorage.getItem("fullname");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    console.log(storedName);

    if (isLoggedIn === "true" && storedName) {
      setIsLoggedIn(true);
    }
  }, [id]);

  const handleBuyClick = () => {
    if (!isLoggedIn) {
      alert("Bạn cần đăng nhập để mua hàng!");
      return;
    }
    setShowForm(true);
  };

  const handlePlaceOrder = async () => {
    if (!address.trim() || !phone.trim() || quantity <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin trước khi đặt hàng.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Số điện thoại phải gồm đúng 10 chữ số.");
      return;
    }
    try {
      if (isLoggedIn) {
        const storedName = localStorage.getItem("fullname");
        const storedNameuer = localStorage.getItem("username");
        await instance.post("/order", {
          fullname: storedName,
          user: storedNameuer,
          product: product?.title,
          quantity,
          address,
          status: "delivered",
        });
      } else {
        alert("Bạn cần đăng nhập để thực hiện đơn hàng.");
        return;
      }

      alert("Đặt hàng thành công!");
      // Reset form
      setShowForm(false);
      setAddress("");
      setPhone("");
      setQuantity(1);
      navigate("/products");
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Đặt hàng thất bại. Vui lòng thử lại.");
    }
  };

  if (!product) return <p>Loading...</p>;

  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;
  const totalPrice = (discountedPrice * quantity + 1).toFixed(2); // +1$ ship

  return (
    <div className="detail-page">
      <div className="product-container">
        <div className="product-header">
          {product.images?.length ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="product-image"
            />
          ) : (
            <p>Không có hình ảnh</p>
          )}

          <div className="product-details">
            <h1 className="product-title">{product.title}</h1>
            <p className="product-price">
              ${discountedPrice.toFixed(2)}{" "}
              <span className="old-price">${product.price}</span>
            </p>
            <p className="product-rating">Rating: {product.rating} / 5</p>
            <p>{product.description}</p>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <div className="product-buttons">
              <button className="cart-button">🛒 Add to Cart</button>
              <button className="buy-button" onClick={handleBuyClick}>
                💳 Buy Now
              </button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="order-form">
            <h3>Điền thông tin đặt hàng</h3>
            <label>
              Số lượng:
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>
            <label>
              Địa chỉ giao hàng:
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <label>
              Số điện thoại:
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <p>
              <strong>Tổng thanh toán:</strong> ${totalPrice} (bao gồm $1 phí
              ship)
            </p>
            <button onClick={handlePlaceOrder}>📦 Đặt hàng</button>
          </div>
        )}

        <div className="suggested-products">
          <h2>Suggested Products</h2>
          <div className="product-suggestions">
            {suggestedProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.images?.length ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="product-image"
                  />
                ) : (
                  <p>Không có hình ảnh</p>
                )}

                <div className="product-details">
                  <h2 className="product-title">{product.title}</h2>
                  <p className="product-price">
                    $
                    {(
                      product.price -
                      (product.price * product.discountPercentage) / 100
                    ).toFixed(2)}{" "}
                    <span className="old-price">${product.price}</span>
                  </p>
                  <p className="product-rating">⭐ {product.rating}/5</p>
                  <Link to={`/product-detail/${product.id}`}>
                    <button className="cart-button">🛒 Add to Cart</button>
                  </Link>
                  <Link to={`/product-detail/${product.id}`}>
                    <button className="buy-button">💳 Buy Now</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}
