import { useState } from "react";
import axios from "./axiosInstance";

const useGetIncentiveAwards = () => {
  const [loadingForGetIncentiveAwards, setLoadingForGetIncentiveAwards] =
    useState(false);
  const [
    loadingForGetIncentiveAwardsForTheMonth,
    setLoadingForGetIncentiveAwardsForTheMonth,
  ] = useState(false);

  const getIncentiveAwards = async (id) => {
    try {
      setLoadingForGetIncentiveAwards(true);
      const response = await axios.get(`/getIncentiveAwards.php`);
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
      setLoadingForGetIncentiveAwards(false);
    }
  };

  const getIncentiveAwardsForTheMonth = async (id) => {
    try {
      setLoadingForGetIncentiveAwardsForTheMonth(true);
      const response = await axios.get(
        `/getIncentiveAwards.php?forTheMonth=true`
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
      setLoadingForGetIncentiveAwardsForTheMonth(false);
    }
  };

  return {
    getIncentiveAwards,
    loadingForGetIncentiveAwards,
    getIncentiveAwardsForTheMonth,
    loadingForGetIncentiveAwardsForTheMonth,
  };
};

export default useGetIncentiveAwards;
