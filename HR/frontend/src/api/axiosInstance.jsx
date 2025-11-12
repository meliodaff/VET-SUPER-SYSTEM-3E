import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost/HR-Information-System/backend/routes/",
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default axiosInstance;
