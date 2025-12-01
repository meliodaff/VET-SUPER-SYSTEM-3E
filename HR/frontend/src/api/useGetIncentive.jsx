import { useState } from "react";
import axios from "./axiosInstance";

const useGetIncentive = () => {
  const [loadingForGetIncentiveItems, setLoadingForGetIncentiveItems] =
    useState(false);
  const [loadingForGetIncentives, setLoadingForGetIncentives] = useState(false);
  const [loadingForGetIncentive, setLoadingForGetIncentive] = useState(false);
  const [
    loadingForGetAllIncentiveForTheMonth,
    setLoadingForGetAllIncentiveForTheMonth,
  ] = useState(false);
  const [loadingForGetTopPerformer, setLoadingForGetTopPerformer] =
    useState(false);

  const getIncentiveItems = async () => {
    try {
      setLoadingForGetIncentiveItems(true);
      const response = await axios.get(`/getIncentive.php?items=true`);
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
      setLoadingForGetIncentiveItems(false);
    }
  };

  const getIncentives = async (isClaim) => {
    try {
      setLoadingForGetIncentives(true);
      const response = await axios.get(`/getIncentive.php?isClaim=${isClaim}`);
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
      setLoadingForGetIncentives(false);
    }
  };

  const getIncentive = async (employeeId) => {
    try {
      setLoadingForGetIncentive(true);
      const response = await axios.get(`/getIncentive.php?id=${employeeId}`);
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
      setLoadingForGetIncentive(false);
    }
  };

  const getAllIncentivesForTheMonth = async () => {
    try {
      setLoadingForGetAllIncentiveForTheMonth(true);
      const response = await axios.get(`/getIncentive.php`);
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
      setLoadingForGetAllIncentiveForTheMonth(false);
    }
  };

  const getTopPerformer = async () => {
    try {
      setLoadingForGetTopPerformer(true);
      const response = await axios.get(`/getIncentive.php?topPerformer=true`);
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
      setLoadingForGetTopPerformer(false);
    }
  };

  return {
    getIncentives,
    loadingForGetIncentives,
    getIncentive,
    loadingForGetIncentive,
    getAllIncentivesForTheMonth,
    loadingForGetAllIncentiveForTheMonth,
    getTopPerformer,
    loadingForGetTopPerformer,
    getIncentiveItems,
    loadingForGetIncentiveItems,
  };
};

export default useGetIncentive;
