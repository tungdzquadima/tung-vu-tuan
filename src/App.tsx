import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ShopPage from "./components/ShopPage/ShopPage";
import HomePage from "./components/HomePage/HomePage";
import AboutPage from "./components/About/AboutPage";
import Login from "./components/Login/Login";
import ProductDetail from "./components/ShopPage/ProductDetail"; // Import ProductDetail component
import Signup from "./Signup/Signup";
import Header from "./components/Header/Header";
import instance from "./axios";

function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const limit = 20;

  useEffect(() => {
    async function fetchApi() {
      try {
        const { data } = await instance.get("/api/v1/products", {
          params: { page, limit },
        });

        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalPages(data.totalPages || 0);
        } else {
          setProducts([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.log("Lỗi không lấy được sản phẩm:", error);
      }
    }
    fetchApi();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ShopPage data={products} page={page} totalPages={totalPages} onPageChange={handlePageChange} />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />  {/* Đảm bảo sử dụng path parameter */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
