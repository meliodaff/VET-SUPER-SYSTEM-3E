import { useState } from "react";
import axios from "./axiosInstance";

const useLogin = () => {
  const [loadingForLogin, setLoadingForLogin] = useState(false);

  const login = async (data) => {
    try {
      setLoadingForLogin(true);
      const response = await axios.post("/login.php", data);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.status >= 400) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }
      return {
        success: false,
        message: "API calling failed",
      };
    } finally {
      setLoadingForLogin(false);
    }
  };

  return {
    login,
    loadingForLogin,
  };
};

export default useLogin;
