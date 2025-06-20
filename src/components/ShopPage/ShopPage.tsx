import { Link } from "react-router-dom";
import "./Shoppage.css";

interface ShopPageProps {
  data: any[]; // Dữ liệu sản phẩm
  page: number; // Trang hiện tại
  totalPages: number; // Tổng số trang
  onPageChange: (page: number) => void; // Hàm thay đổi trang
}

function ShopPage({ data, page, totalPages, onPageChange }: ShopPageProps) {
  if (!data.length) return       <i className="fas fa-spinner fa-spin fa-5x"></i>
;

  // Hàm xử lý khi nhấn nút "Trang trước"
  const handlePreviousPage = () => {
    if (page > 0) onPageChange(page - 1); // Chuyển về trang trước nếu không phải trang đầu
  };

  // Hàm xử lý khi nhấn nút "Trang sau"
  const handleNextPage = () => {
    if (page + 1 < totalPages) onPageChange(page + 1); // Chuyển về trang tiếp theo nếu không phải trang cuối
  };

  return (
    <div className="shop-page">
      <div className="listProduct">
        {data.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product-detail/${product.id}`} className="product-link">
              {/* Kiểm tra thumbnail nếu có ảnh */}
              <img
                src={product.thumbnail || "/default-image.png"}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-price">
                  {product.price.toLocaleString()} VND
                </p>
                <p className="product-description">
                  {product.description.length > 100
                    ? `${product.description.substring(0, 100)}...`
                    : product.description}
                </p>
              </div>
              <button
              className="order-button"
              onClick={() => {
                // Handle đặt hàng (ví dụ: mở modal hoặc điều hướng đến trang thanh toán)
                console.log("Đặt hàng sản phẩm với ID: ", product.id);
              }}
            >
              Đặt hàng
            </button>
            </Link>

            {/* Button đặt hàng */}
            
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 0}>
          Trang trước
        </button>
        <span>
          Trang {page + 1} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page + 1 >= totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default ShopPage;
