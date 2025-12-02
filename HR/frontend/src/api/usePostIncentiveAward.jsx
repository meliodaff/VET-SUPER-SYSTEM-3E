import { useState } from "react";
import axios from "./axiosInstance";

const usePostIncentiveAward = () => {
  const [loadingForPostIncentiveAward, setLoadingForPostIncentiveAward] =
    useState(false);

  const postIncentiveAward = async (data) => {
    try {
      setLoadingForPostIncentiveAward(true);
      const response = await axios.post("/postIncentiveAward.php", data);
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
      setLoadingForPostIncentiveAward(false);
    }
  };

  return {
    postIncentiveAward,
    loadingForPostIncentiveAward,
  };
};

export default usePostIncentiveAward;
