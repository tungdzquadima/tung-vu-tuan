import { Link } from "react-router-dom";
import "./Shoppage.css";

interface ShopPageProps {
  data: any[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
function ShopPage({ data, page, totalPages, onPageChange }: ShopPageProps) {
  if (!data.length) return <p>Không có sản phẩm nào.</p>;

  return (
    <div className="shop-page">
      <div className="listProduct">
        {data.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product-detail/${product.id}`} className="product-link">
              {/* <img
                src={product.thumbnail || "/default-image.png"}
                alt={product.name}
                className="product-image"
              /> */}
              <div className="product-details">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-price">${product.price.toLocaleString()}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 0}>
          Trang trước
        </button>
        <span>
          Trang {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page + 1 >= totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}


export default ShopPage;
