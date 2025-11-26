import { useState } from "react";
import axios from "./axiosInstance";

const useGetJobApplicants = () => {
  const [loadingForGetJobApplicant, setLoadingForGetJobApplicant] =
    useState(false);
  const [
    loadingForGetJobApplicantForInterview,
    setLoadingForGetJobApplicantForInterview,
  ] = useState(false);

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
  const getJobApplicantsForInterview = async () => {
    try {
      setLoadingForGetJobApplicantForInterview(true);
      const response = await axios.get(
        "/getJobApplicant.php?forInterview=true"
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
      setLoadingForGetJobApplicantForInterview(false);
    }
  };

  return {
    getJobApplicants,
    loadingForGetJobApplicant,
    getJobApplicantsForInterview,
    loadingForGetJobApplicantForInterview,
  };
};

export default useGetJobApplicants;
