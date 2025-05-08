import "./App.css";
import Header from "./components/Header/Header";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import AboutPage from "./components/About/AboutPage";
import ShopPage from "./components/ShopPage/ShopPage";
import Login from "./components/Login/Login";
import instance from "./axios";
import { useEffect, useState } from "react";
import ProductDetail from "./components/ShopPage/ProductDetail";
import Signup from "./Signup/Signup";
import Ad from "./admin/Ad";
function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchapi() {
      try {
        const { data } = await instance.get("/products");
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.log("lỗi ko set đc sản phẩm");
      }
    }
    fetchapi();
  }, []);

  return (
    <>
      <div className="header">
        <Header />
      </div>
      <div className="main">
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ShopPage data={products} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product-detail/:id" element={<ProductDetail />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<Ad />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
