import { useState } from "react";
import axios from "./axiosInstance";

const useInsertJobApplicant = () => {
  const [loadingForJobApplicant, setLoadingForJobApplicant] = useState(false);

  const insertJobApplicant = async (jobApplicant) => {
    try {
      setLoadingForJobApplicant(true);
      const response = await axios.post(
        "/insertJobApplicant.php",
        jobApplicant
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
      setLoadingForJobApplicant(false);
    }
  };

  return {
    insertJobApplicant,
    loadingForJobApplicant,
  };
};

export default useInsertJobApplicant;
