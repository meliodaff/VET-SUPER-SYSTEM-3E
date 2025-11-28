import { useState } from "react";
import axios from "./axiosInstance";

const usePostAnnouncement = () => {
  const [loadingForPostAnnouncement, setLoadingForPostAnnouncement] =
    useState(false);

  const postAnnouncement = async (data) => {
    try {
      setLoadingForPostAnnouncement(true);
      const response = await axios.post("/insertAnnouncement.php", data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
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
      setLoadingForPostAnnouncement(false);
    }
  };

  return {
    postAnnouncement,
    loadingForPostAnnouncement,
  };
};

export default usePostAnnouncement;
