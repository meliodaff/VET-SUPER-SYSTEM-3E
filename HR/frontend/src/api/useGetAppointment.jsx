import { useState } from "react";
import axios from "./axiosInstance";

const useGetAppointment = () => {
  const [loadingForGetAppointment, setLoadingForGetAppointment] =
    useState(false);

  const getAppointment = async (employeeId) => {
    try {
      setLoadingForGetAppointment(true);
      const response = await axios.get(`/getAppointment.php?id=${employeeId}`);
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
      setLoadingForGetAppointment(false);
    }
  };

  return {
    getAppointment,
    loadingForGetAppointment,
  };
};

export default useGetAppointment;
