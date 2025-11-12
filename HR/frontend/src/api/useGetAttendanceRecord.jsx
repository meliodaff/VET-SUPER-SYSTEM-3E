import { useState } from "react";
import axios from "./axiosInstance";

const useGetAttendanceRecord = () => {
  const [loadingForGetAttendanceRecords, setLoadingForGetAttendanceRecords] =
    useState(false);

  const [
    loadingForGetAttendanceRecordsForToday,
    setLoadingForGetAttendanceRecordsForToday,
  ] = useState(false);

  const [
    loadingForGetAttendanceRecordForToday,
    setLoadingForGetAttendanceRecordForToday,
  ] = useState(false);

  const [loadingForGetAttendanceRecord, setLoadingForGetAttendanceRecord] =
    useState(false);
  const [
    loadingForGetAttendanceRecordForMonth,
    setLoadingForGetAttendanceRecordForMonth,
  ] = useState(false);

  const [
    loadingForGetOverAllAttendancePerMonth,
    setLoadingForGetOverAllAttendancePerMonth,
  ] = useState(false);

  const [loadingForAllAttendanceById, setLoadingForAllAttendanceById] =
    useState(false);

  const getAttendanceRecords = async (date) => {
    const newDate = new Date(date).toISOString().split("T")[0];
    console.log(newDate);
    // const [month, day, year] = date.split("/");
    // const formattedDate = `${year}-${month}-${day}`;
    try {
      setLoadingForGetAttendanceRecords(true);
      const response = await axios.get(
        `/getAttendanceRecord.php?date=${newDate}`
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
      setLoadingForGetAttendanceRecords(false);
    }
  };

  const getAttendanceRecordsForToday = async () => {
    try {
      setLoadingForGetAttendanceRecordsForToday(true);
      const response = await axios.get("/getAttendanceRecord.php");
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
      setLoadingForGetAttendanceRecordsForToday(false);
    }
  };

  const getAttendanceRecord = async (employeeId, date) => {
    try {
      setLoadingForGetAttendanceRecord(true);
      const response = await axios.get(
        `/getAttendanceRecord.php?id=${employeeId}&date=${date}`
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
      setLoadingForGetAttendanceRecord(false);
    }
  };

  const getAttendanceRecordForToday = async (employeeId) => {
    try {
      setLoadingForGetAttendanceRecordForToday(true);
      const response = await axios.get(
        `/getAttendanceRecord.php?id=${employeeId}`
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
      setLoadingForGetAttendanceRecordForToday(false);
    }
  };

  const getAttendanceRecordForMonth = async (employeeId, month) => {
    try {
      setLoadingForGetAttendanceRecordForMonth(true);
      const responseForAttendanceRecord = await axios.get(
        `/getAttendanceRecord.php?id=${employeeId}&month=${month}`
      );

      const responseForAttendanceSummary = await axios.get(
        `/getAttendanceRecord.php?attendanceSummary=true&id=${employeeId}`
      );
      return [
        responseForAttendanceRecord.data,
        responseForAttendanceSummary.data,
      ];
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
      setLoadingForGetAttendanceRecordForMonth(false);
    }
  };

  const getOverAllAttendancePerMonth = async () => {
    try {
      setLoadingForGetOverAllAttendancePerMonth(true);
      const response = await axios.get(
        `/getAttendanceRecord.php?overAllAttendance=true`
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
      setLoadingForGetOverAllAttendancePerMonth(false);
    }
  };

  const getAllAttendanceById = async (id) => {
    try {
      setLoadingForAllAttendanceById(true);
      const response = await axios.get(
        `/getAttendanceRecord.php?id=${id}&all=true`
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
      setLoadingForAllAttendanceById(false);
    }
  };

  return {
    getAttendanceRecords,
    loadingForGetAttendanceRecords,
    getAttendanceRecordsForToday,
    loadingForGetAttendanceRecordsForToday,
    getAttendanceRecord,
    getAttendanceRecordForToday,
    loadingForGetAttendanceRecordForToday,
    loadingForGetAttendanceRecord,
    loadingForGetAttendanceRecordForMonth,
    getAttendanceRecordForMonth,
    getOverAllAttendancePerMonth,
    loadingForGetOverAllAttendancePerMonth,
    getAllAttendanceById,
    loadingForAllAttendanceById,
  };
};

export default useGetAttendanceRecord;
