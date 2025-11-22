import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost/VET-SUPER-SYSTEM-3E/HR/backend/routes/",
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default axiosInstance;
