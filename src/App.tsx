// import "./App.css";
// import Header from "./components/Header/Header";
// import { Route, Routes } from "react-router-dom";
// import HomePage from "./components/HomePage/HomePage";
// import AboutPage from "./components/About/AboutPage";
// import ShopPage from "./components/ShopPage/ShopPage";
// import Login from "./components/Login/Login";
// import instance from "./axios";
// import { useEffect, useState } from "react";
// import ProductDetail from "./components/ShopPage/ProductDetail";
// import Signup from "./Signup/Signup";
// import Ad from "./admin/Ad";
// function App() {
//   const [products, setProducts] = useState([]);

// useEffect(() => {
//   async function fetchApi() {
//     try {
//       const { data } = await instance.get("/api/v1/products", {
//         params: { page: 0, limit: 12 },
//       });
//       if (data.products && Array.isArray(data.products)) {
//         setProducts(data.products);
//       } else {
//         setProducts([]);
//       }
//     } catch (error) {
//       console.log("Lỗi không lấy được sản phẩm:", error);
//     }
//   }

//   fetchApi();
  
// }, []);
//       console.log("đây là products");

//       console.log(products);


//   return (
//     <>
//       <div className="header">
//         <Header />
//       </div>
//       <div className="main">
//         <main>
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/about" element={<AboutPage />} />
//             <Route path="/products" element={<ShopPage data={products} />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/product-detail/:id" element={<ProductDetail />} /> 
//             <Route path="/signup" element={<Signup />} />
//              <Route path="/admin" element={<Ad />} />
//           </Routes>
//         </main>
//       </div>
//     </>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import ShopPage from "./components/ShopPage/ShopPage";
import instance from "./axios";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import AboutPage from "./components/About/AboutPage";
import Login from "./components/Login/Login";
import ProductDetail from "./components/ShopPage/ProductDetail";
import Signup from "./Signup/Signup";
import Ad from "./admin/Ad";
import Header from "./components/Header/Header";
import AdminPage from "./admin/Ad";

function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const limit = 12;

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
  }, [page]); // gọi lại khi page thay đổi

  // Hàm xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
    <Header/>
      {/* Các phần khác */}
      <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/about" element={<AboutPage />} />
//             <Route path="/products" element={<ShopPage data={products}page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange} />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/product-detail/:id" element={<ProductDetail />} /> 
//             <Route path="/signup" element={<Signup />} />
//              <Route path="/admin" element={<AdminPage />} />
//           </Routes>
      
    </>
  );
}

export default App;
