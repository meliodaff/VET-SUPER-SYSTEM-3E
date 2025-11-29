import { useState } from "react";
import axios from "./axiosInstance";

const usePostPatientAccount = () => {
  const [loadingForPostPatientAccount, setLoadingForPostPatientAccount] =
    useState(false);

  const postPatientAccount = async (data) => {
    try {
      setLoadingForPostPatientAccount(true);
      const response = await axios.post("/insertPatientAccount.php", data);
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
      setLoadingForPostPatientAccount(false);
    }
  };

  return {
    postPatientAccount,
    loadingForPostPatientAccount,
  };
};

export default usePostPatientAccount;
