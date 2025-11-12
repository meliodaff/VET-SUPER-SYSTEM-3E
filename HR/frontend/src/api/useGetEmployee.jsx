import { useState } from "react";
import axios from "./axiosInstance";

const useGetEmployees = () => {
  const [loadingForGetEmployees, setLoadingForGetEmployees] = useState(false);
  const [loadingForGetEmployee, setLoadingForGetEmployee] = useState(false);

  const getEmployees = async () => {
    try {
      setLoadingForGetEmployees(true);
      const response = await axios.get("/getEmployee.php");
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
      setLoadingForGetEmployees(false);
    }
  };

  const getEmployee = async (employeeId) => {
    try {
      setLoadingForGetEmployee(true);
      const response = await axios.get(`/getEmployee.php?id=${employeeId}`);
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
      setLoadingForGetEmployee(false);
    }
  };

  return {
    getEmployees,
    loadingForGetEmployees,
    getEmployee,
    loadingForGetEmployee,
  };
};

export default useGetEmployees;
