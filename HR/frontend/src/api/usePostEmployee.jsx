import { useState } from "react";
import axios from "./axiosInstance";

const usePostEmployee = () => {
  const [loadingForPostEmployee, setLoadingForPostEmployee] = useState(false);

  const postEmployee = async (data) => {
    try {
      setLoadingForPostEmployee(true);
      const response = await axios.post("/insertEmployee.php", data);
      console.log(response.data);
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
      setLoadingForPostEmployee(false);
    }
  };

  return {
    postEmployee,
    loadingForPostEmployee,
  };
};

export default usePostEmployee;
