import { useState } from "react";
import axios from "./axiosInstance";

const usePatchIncentiveAward = () => {
  const [loadingForPatchIncentiveAward, setLoadingForPatchIncentiveAward] =
    useState(false);

  const patchIncentiveAward = async (award_id, status) => {
    try {
      setLoadingForPatchIncentiveAward(true);
      const response = await axios.post(`/patchIncentiveAward.php`, {
        award_id: award_id,
        status: status,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        console.log(error);
        return {
          success: false,
          message: error.response.data.message || error.response.data.error,
        };
      }
      return {
        success: false,
        message: "API calling failed",
      };
    } finally {
      setLoadingForPatchIncentiveAward(false);
    }
  };

  return {
    patchIncentiveAward,
    loadingForPatchIncentiveAward,
  };
};

export default usePatchIncentiveAward;
