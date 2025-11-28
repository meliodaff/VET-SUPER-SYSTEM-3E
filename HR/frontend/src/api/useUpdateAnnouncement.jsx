import { useState } from "react";
import axios from "./axiosInstance";

const useUpdateAnnouncement = () => {
  const [loadingForUpdateAnnouncement, setLoadingForUpdateAnnouncement] =
    useState(false);

  const updateAnnouncement = async (formData) => {
    try {
      setLoadingForUpdateAnnouncement(true);
      const response = await axios.post("/patchAnnouncement.php", formData);
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
      setLoadingForUpdateAnnouncement(false);
    }
  };

  return {
    updateAnnouncement,
    loadingForUpdateAnnouncement,
  };
};

export default useUpdateAnnouncement;
