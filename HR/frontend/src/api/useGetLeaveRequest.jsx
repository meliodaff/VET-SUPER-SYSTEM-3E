import { useState } from "react";
import axios from "./axiosInstance";

const useGetLeaveRequest = () => {
  const [loadingForGetLeaveRequests, setLoadingForGetLeaveRequests] =
    useState(false);
  const [loadingForGetLeaveRequest, setLoadingForGetLeaveRequest] =
    useState(false);

  const getLeaveRequests = async () => {
    try {
      setLoadingForGetLeaveRequests(true);
      const response = await axios.get(`/getLeaveRequest.php`);
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
      setLoadingForGetLeaveRequests(false);
    }
  };
  const getLeaveRequest = async (id) => {
    try {
      setLoadingForGetLeaveRequest(true);
      const response = await axios.get(`/getLeaveRequest.php?id=${id}`);
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
      setLoadingForGetLeaveRequest(false);
    }
  };

  return {
    getLeaveRequest,
    getLeaveRequests,
    loadingForGetLeaveRequest,
    loadingForGetLeaveRequests,
  };
};

export default useGetLeaveRequest;
