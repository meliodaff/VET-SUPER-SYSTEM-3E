import { useState } from "react";
import axios from "./axiosInstance";

const usePostPerformanceReviews = () => {
  const [
    loadingForPostPerformanceReviews,
    setLoadingForPostPerformanceReviews,
  ] = useState(false);

  const postPerformanceReviews = async (data) => {
    try {
      setLoadingForPostPerformanceReviews(true);
      const response = await axios.post("/postPerformanceReviews.php", data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      console.log(error.status);
      if (error.status >= 400) {
        return {
          success: false,
          message: error.response.data,
        };
      }
      return {
        success: false,
        message: "API calling failed",
      };
    } finally {
      setLoadingForPostPerformanceReviews(false);
    }
  };

  return {
    postPerformanceReviews,
    loadingForPostPerformanceReviews,
  };
};

export default usePostPerformanceReviews;
