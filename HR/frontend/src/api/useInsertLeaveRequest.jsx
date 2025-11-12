import { useState } from "react";
import axios from "./axiosInstance";

const useInsertLeaveRequest = () => {
  const [loadingForLeaveRequest, setLoadingForLeaveRequest] = useState(false);

  const insertLeaveRequest = async (leaveRequest) => {
    setLoadingForLeaveRequest(true);
    try {
      const response = await axios.post(
        "/insertLeaveRequest.php",
        leaveRequest
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
      setLoadingForLeaveRequest(false);
    }
  };

  return {
    insertLeaveRequest,
    loadingForLeaveRequest,
  };
};

export default useInsertLeaveRequest;
