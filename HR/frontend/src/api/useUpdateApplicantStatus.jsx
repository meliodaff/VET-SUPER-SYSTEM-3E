import { useState } from "react";
import axios from "./axiosInstance";

const useUpdateApplicantStatus = () => {
  const [loadingForUpdateApplicantStatus, setLoadingForUpdateApplicantStatus] =
    useState(false);

  const updateApplicantStatus = async (formData) => {
    try {
      setLoadingForUpdateApplicantStatus(true);
      const response = await axios.post("/updateApplicantStatus.php", formData);
      console.log(response);
      return response.data;
    } catch (error) {
      if (error.status >= 400) {
        console.log(error);
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
