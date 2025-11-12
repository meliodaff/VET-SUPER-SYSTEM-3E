import { useState } from "react";
import axios from "./axiosInstance";

const useGetEmployeeAnalytics = () => {
  const [loadingForGetEmployeeAnalytics, setLoadingForGetEmployeeAnalytics] =
    useState(false);

  const getEmployeeAnalytics = async (id) => {
    try {
      setLoadingForGetEmployeeAnalytics(true);
      const response = await axios.get(
        `/getAnalyticsByEmployeeId.php?id=${id}`
      );
      return response.data;
    } catch (error) {
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
      setLoadingForGetEmployeeAnalytics(false);
    }
  };

  return {
    getEmployeeAnalytics,
    loadingForGetEmployeeAnalytics,
  };
};

export default useGetEmployeeAnalytics;
