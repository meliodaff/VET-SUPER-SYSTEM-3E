import { useState } from "react";
import axios from "./axiosInstance";

const useGetAttendancePercentage = () => {
  const [
    loadingForGetAttendancePercetage,
    setLoadingForGetAttendancePercetage,
  ] = useState(false);

  const getAttendancePercentage = async (data) => {
    try {
      setLoadingForGetAttendancePercetage(true);
      const response = await axios.get(
        `/getAttendancePercentage.php?id=${data.id}&date=${data.date}&year=${data.year}&month=${data.month}`
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
      setLoadingForGetAttendancePercetage(false);
    }
  };

  return {
    getAttendancePercentage,
    loadingForGetAttendancePercetage,
  };
};

export default useGetAttendancePercentage;
