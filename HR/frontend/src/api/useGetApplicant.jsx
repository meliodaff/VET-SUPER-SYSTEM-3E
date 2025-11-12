import { useState } from "react";
import axios from "./axiosInstance";

const useGetJobApplicants = () => {
  const [loadingForGetJobApplicant, setLoadingForGetJobApplicant] =
    useState(false);

  const getJobApplicants = async () => {
    try {
      setLoadingForGetJobApplicant(true);
      const response = await axios.get("/getJobApplicant.php");
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
      setLoadingForGetJobApplicant(false);
    }
  };

  return {
    getJobApplicants,
    loadingForGetJobApplicant,
  };
};

export default useGetJobApplicants;
