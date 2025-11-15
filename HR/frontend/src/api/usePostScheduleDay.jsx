import { useState } from "react";
import axios from "./axiosInstance";

const usePostScheduleDay = () => {
  const [loadingForPostScheduleDay, setLoadingForPostScheduleDay] =
    useState(false);
  const [loadingForDeleteScheduleDay, setLoadingForDeleteScheduleDay] =
    useState(false);

  const postScheduleDay = async (employeeId, scheduleDay) => {
    try {
      const data = { employeeId, scheduleDay };
      setLoadingForPostScheduleDay(true);
      const response = await axios.post(`/postScheduleDay.php`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.status >= 400) {
        return {
          success: false,
          message: error.response.data.error,
        };
      }
      return {
        success: false,
        message: "API calling failed",
      };
    } finally {
      setLoadingForPostScheduleDay(false);
    }
  };
  const deleteScheduleDay = async (employeeId, scheduleDay) => {
    try {
      const data = { employeeId, scheduleDay };
      setLoadingForDeleteScheduleDay(true);
      const response = await axios.post(`/deleteScheduleDay.php`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.status >= 400) {
        return {
          success: false,
          message: error.response.data.error,
        };
      }
      return {
        success: false,
        message: "API calling failed",
      };
    } finally {
      setLoadingForDeleteScheduleDay(false);
    }
  };

  return {
    postScheduleDay,
    loadingForPostScheduleDay,
    deleteScheduleDay,
    loadingForDeleteScheduleDay,
  };
};

export default usePostScheduleDay;
