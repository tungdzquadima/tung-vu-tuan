import { useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import ShopPage from "./components/ShopPage/ShopPage";
import HomePage from "./components/HomePage/HomePage";
import AboutPage from "./components/About/AboutPage";
import Login from "./components/Login/Login";
import ProductDetail from "./components/ShopPage/ProductDetail"; // Import ProductDetail component
import Signup from "./Signup/Signup";
import Header from "./components/Header/Header";
import instance from "./axios";
import AdminPage from "./admin/Ad";
import UserProfile from "./components/User/UserProfile/UserProfile";
import Order from "./components/User/Order/Order";

function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [categories, setCategories] = useState<any[]>([]); // Để lưu trữ danh mục
  const [selectedCategory, setSelectedCategory] = useState<number>(4); // Mặc định là "Máy tính"
  const limit = 20;
const [searchParams] = useSearchParams();
const searchKeyword = searchParams.get("search");


  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await instance.get("/api/v1/products/search", {
          params: {
            name: searchKeyword,
            page: 0,
            limit: 10,
          },
        });

        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
        setProducts([]);
      }
    }

    if (searchKeyword) {
      fetchProducts();
    }
  }, [searchKeyword]);

  // Fetch danh mục sản phẩm
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await instance.get("/api/v1/categories/getAll");
        if (data && Array.isArray(data)) {
          setCategories(data);
          console.log("Danh mục đã được lấy:", data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.log("Lỗi không lấy được danh mục:", error);
      }
    }

    fetchCategories();
  }, []);

  // Fetch sản phẩm theo category và phân trang
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await instance.get("/api/v1/products/category/" + selectedCategory, {
          params: { page, limit },
        });

        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalPages(data.totalPages || 0);  // Sử dụng totalPages để phân trang
        } else {
          setProducts([]); // Nếu không có sản phẩm, set mảng rỗng
          setTotalPages(0); // Tổng số trang = 0 nếu không có sản phẩm
        }
      } catch (error) {
        console.log("Lỗi không lấy được sản phẩm:", error);
      }
    }
    fetchProducts();
  }, [page, selectedCategory]); // Cập nhật khi page hoặc category thay đổi

  // Hàm thay đổi danh mục
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setPage(0); // Khi thay đổi category, reset lại trang về 0
  };

  // Hàm thay đổi trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);  // Cập nhật trang mới
    }
  };

  return (
    <>

      <Header categories={categories} onCategoryChange={handleCategoryChange} />
      <Routes>
        <Route path="/" element={<ShopPage data={products} page={page} totalPages={totalPages} onPageChange={handlePageChange} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ShopPage data={products} page={page} totalPages={totalPages} onPageChange={handlePageChange} />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/orders" element={<Order />} />
      </Routes>
      
      
    </>
  );
}

export default App;
