import { useState } from "react";
import axios from "./axiosInstance";

const usePatchLeaveRequest = () => {
  const [loadingForPatchLeaveRequest, setLoadingForPatchLeaveRequest] =
    useState(false);

  const patchLeaveRequests = async (requestId, status, id) => {
    try {
      setLoadingForPatchLeaveRequest(true);
      const response = await axios.get(
        `/patchLeaveRequest.php?id=${id}&requestId=${requestId}&status=${status}`
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
      setLoadingForPatchLeaveRequest(false);
    }
  };

  return {
    patchLeaveRequests,
    loadingForPatchLeaveRequest,
  };
};

export default usePatchLeaveRequest;
