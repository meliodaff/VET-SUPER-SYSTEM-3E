import { useState } from "react";
import axios from "./axiosInstance";

const useGetSchedule = () => {
  const [loadingForGetSchedule, setLoadingForGetSchedule] = useState(false);

  const getSchedules = async () => {
    try {
      setLoadingForGetSchedule(true);
      const response = await axios.get(`/getSchedule.php`);
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
      setLoadingForGetSchedule(false);
    }
  };

  return {
    getSchedules,
    loadingForGetSchedule,
  };
};

export default useGetSchedule;
