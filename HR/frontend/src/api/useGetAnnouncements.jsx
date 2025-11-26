import { useState } from "react";
import axios from "./axiosInstance";

const useGetAnnouncements = () => {
  const [loadingForGetAnnouncements, setLoadingForGetAnnouncements] =
    useState(false);

  const getAnnouncements = async (id) => {
    try {
      setLoadingForGetAnnouncements(true);
      const response = await axios.get(`/getAnnouncement.php`);
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
      setLoadingForGetAnnouncements(false);
    }
  };

  return {
    getAnnouncements,
    loadingForGetAnnouncements,
  };
};

export default useGetAnnouncements;
