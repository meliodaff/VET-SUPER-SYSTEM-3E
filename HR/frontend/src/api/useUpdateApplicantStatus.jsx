import { useState } from "react";
import axios from "./axiosInstance";

const useUpdateApplicantStatus = () => {
  const [loadingForUpdateApplicantStatus, setLoadingForUpdateApplicantStatus] =
    useState(false);

  const updateApplicantStatus = async (data) => {
    try {
      setLoadingForUpdateApplicantStatus(true);
      const response = await axios.post("/updateApplicantStatus.php", data);
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
      setLoadingForUpdateApplicantStatus(false);
    }
  };

  return {
    updateApplicantStatus,
    loadingForUpdateApplicantStatus,
  };
};

export default useUpdateApplicantStatus;
