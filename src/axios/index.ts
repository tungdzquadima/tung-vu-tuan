import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8088",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});

// ✅ Interceptor: Gửi token tự động trong mỗi request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Backend thường yêu cầu định dạng này
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
