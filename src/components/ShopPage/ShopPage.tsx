import { Link } from "react-router-dom";
import "./Shoppage.css";
function ShopPage({ data }: any) {
  const products = data;
  console.log("data trong cpn");
  console.log(products[0]);
  return (
    <div className="shop-page">
      <div className="listProduct">
        {products &&
          products.map((product: any) => (
            <div key={product.id} className="product-card">
              <Link
                to={`/product-detail/${product.id}`}
                className="product-link"
              >
                <img
                  src={product.images[0]}
                  alt={product.title || "Product image"}
                  className="product-image"
                />
                <div className="product-details">
                  <h2 className="product-title">{product.title}</h2>
                  <p className="product-brand">Brand: {product.brand}</p>
                  <p className="product-price">
                    $
                    {(
                      product.price -
                      (product.price * product.discountPercentage) / 100
                    ).toFixed(2)}{" "}
                    <span className="original-price">${product.price}</span>
                  </p>
                  <p className="product-rating">⭐ {product.rating}/5</p>
                  <p className="product-stock">
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                  <div className="product-buttons">
                    <button className="add-to-cart-btn">🛒 Add to Cart</button>
                    <button className="buy-now-btn">💳 Buy Now</button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
export default ShopPage;
