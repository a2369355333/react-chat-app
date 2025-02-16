import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "",
  timeout: 100000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (e) => {
    console.error("Request Error:", e);
    return Promise.reject(e);
  }
);

apiClient.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (e) => {
    const { res } = e;
    if (res) {
      // 伺服器回應了狀態，並且不是 2xx
      console.error("API Error:", res.status, res.data);
    } else {
      console.error("Network Error:", e.message);
    }
    return Promise.reject(e);
  }
);

const apiService = {
  get: (url) => {
    return apiClient.get(url);
  },
  post: (url, data) => {
    return apiClient.post(url, data);
  },
  put: (url, data) => {
    return apiClient.put(url, data);
  },
  delete: (url) => {
    return apiClient.delete(url);
  },
  setToken: (token) => {
    Cookies.set("token", token, { expires: 7 }); // 設 token，過期時間為 7 天
  },
  removeToken: () => {
    Cookies.remove("token");
  },
};

export default apiService;
