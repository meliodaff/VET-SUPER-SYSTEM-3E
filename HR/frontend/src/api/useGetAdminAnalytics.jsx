import { useState } from "react";
import axios from "./axiosInstance";

const useGetAdminAnalytics = () => {
  const [loadingForGetAdminAnalytics, setLoadingForGetAdminAnalytics] =
    useState(false);

  const getAdminAnalytics = async () => {
    try {
      setLoadingForGetAdminAnalytics(true);
      const response = await axios.get("/getAnalytics.php");
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
      setLoadingForGetAdminAnalytics(false);
    }
  };

  return {
    getAdminAnalytics,
    loadingForGetAdminAnalytics,
  };
};

export default useGetAdminAnalytics;
