import { useState } from "react";
import axios from "./axiosInstance";

const useGetPerformanceReviews = () => {
  const [loadingForGePerformanceReviews, setLoadingForGePerformanceReviews] =
    useState(false);
  const [
    loadingForGetPerformanceReviewsReport,
    setLoadingForGetPerformanceReviewsReport,
  ] = useState(false);

  const getPerformanceReviews = async (id) => {
    try {
      setLoadingForGePerformanceReviews(true);
      const response = await axios.get(`/getPerformanceReviews.php`);
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
      setLoadingForGePerformanceReviews(false);
    }
  };

  const getPerformanceReviewsReport = async (id) => {
    try {
      setLoadingForGetPerformanceReviewsReport(true);
      const response = await axios.get(
        `/getPerformanceReviews.php?report=true`
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
      setLoadingForGetPerformanceReviewsReport(false);
    }
  };

  return {
    getPerformanceReviews,
    loadingForGePerformanceReviews,
    getPerformanceReviewsReport,
    loadingForGetPerformanceReviewsReport,
  };
};

export default useGetPerformanceReviews;
