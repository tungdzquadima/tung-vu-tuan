// // types/Product.ts

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import instance from "../../axios";
// import "./css.css";
// export default function ProductDetail() {
//   const { id } = useParams<{ id: string }>();
//   const [product, setProduct] = useState<Product | null>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await instance.get<Product>(`/products/${id}`);
//         setProduct(data);
//       } catch (error) {
//         console.error(error);
//       }
//     })();
//   }, [id]);

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="product-container">
//       <div className="product-header">
//         <img
//           src={product.images[0]}
//           alt={product.title}
//           className="product-image"
//         />
//         <div className="product-details">
//           <h1 className="product-title">{product.title}</h1>
//           <p className="product-price">
//             $
//             {(
//               product.price -
//               (product.price * product.discountPercentage) / 100
//             ).toFixed(2)}
//             <span className="old-price">${product.price}</span>
//           </p>
//           <p className="product-rating">Rating: {product.rating} / 5</p>
//           <p>{product.description}</p>
//           <p>
//             <strong>Brand:</strong> {product.brand}
//           </p>
//           <div className="product-buttons">
//             <button className="cart-button">🛒 Add to Cart</button>
//             <button className="buy-button">💳 Buy Now</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export interface Review {
//   rating: number;
//   comment: string;
//   date: string;
//   reviewerName: string;
//   reviewerEmail: string;
// }

// export interface Product {
//   id: number;
//   title: string;
//   description: string;
//   category: string;
//   price: number;
//   discountPercentage: number;
//   rating: number;
//   stock: number;
//   tags: string[];
//   brand: string;
//   sku: string;
//   weight: number;
//   dimensions: {
//     width: number;
//     height: number;
//     depth: number;
//   };
//   warrantyInformation: string;
//   shippingInformation: string;
//   availabilityStatus: string;
//   reviews: Review[];
//   returnPolicy: string;
//   minimumOrderQuantity: number;
//   meta: {
//     createdAt: string;
//     updatedAt: string;
//     barcode: string;
//     qrCode: string;
//   };
//   images: string[];
//   thumbnail: string;
// }
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../../axios";
import "./css.css";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Lấy thông tin sản phẩm hiện tại
    (async () => {
      try {
        const { data } = await instance.get<Product>(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    })();

    // Lấy các sản phẩm đề xuất ngẫu nhiên
    (async () => {
      try {
        const { data } = await instance.get<Product[]>("/products");

        // Trộn các sản phẩm ngẫu nhiên
        const shuffledProducts = data.sort(() => Math.random() - 0.5);

        // Lấy 4 sản phẩm ngẫu nhiên
        setSuggestedProducts(shuffledProducts.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    })();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-container">
      <div className="product-header">
        <img
          src={product.images[0]}
          alt={product.title}
          className="product-image"
        />
        <div className="product-details">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-price">
            $
            {(
              product.price -
              (product.price * product.discountPercentage) / 100
            ).toFixed(2)}
            <span className="old-price">${product.price}</span>
          </p>
          <p className="product-rating">Rating: {product.rating} / 5</p>
          <p>{product.description}</p>
          <p>
            <strong>Brand:</strong> {product.brand}
          </p>
          <div className="product-buttons">
            <button className="cart-button">🛒 Add to Cart</button>
            <button className="buy-button">💳 Buy Now</button>
          </div>
        </div>
      </div>

      <div className="suggested-products">
        <h2>Suggested Products</h2>
        <div className="product-suggestions">
          {suggestedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.images[0]}
                alt={product.title}
                className="product-image"
              />
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
                <Link
                  to={`/product-detail/${product.id}`}
                  className="cart-button-link"
                >
                  <button className="cart-button">🛒 Add to Cart</button>
                </Link>
                <Link
                  to={`/product-detail/${product.id}`}
                  className="buy-button-link"
                >
                  <button className="buy-button">💳 Buy Now</button>
                </Link>
              </div>
            </div>
          ))}
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
