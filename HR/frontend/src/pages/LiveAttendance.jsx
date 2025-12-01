import React, { useEffect, useState, useRef } from "react";

const Attendance = () => {
  const [rfidData, setRfidData] = useState({
    name: "",
    timestamp: "",
    timeIn: " - ",
    timeOut: " - ",
  });
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const isProcessingRef = useRef(false);

  const styles = {
    global: {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      fontFamily: '"Poppins", sans-serif',
    },
    body: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: "url('/images/background.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    attendance: {
      width: "50%",
      padding: "40px",
      position: "relative",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "50px",
    },
    logoImg: {
      width: "150px",
      height: "140px",
    },
    logoH1: {
      fontSize: "40px",
      color: "#5080BE", // Updated from #5080be
      fontWeight: 800,
    },
    form: {
      textAlign: "center",
      marginLeft: "30px",
      marginTop: "-10px",
    },
    title: {
      fontSize: "28px",
      color: "#5080BE", // Updated from #1d5e9e
      marginBottom: "30px",
      fontWeight: 600,
    },
    input: {
      display: "block",
      width: "100%",
      marginBottom: "12px",
      padding: "10px 12px",
      border: "1px solid #e5e7eb", // Updated from #ccc (light gray)
      borderRadius: "8px",
      fontSize: "15px",
      backgroundColor: "#fff",
      transition: "all 0.2s",
    },
    inputFocus: {
      borderColor: "#5080BE",
      outline: "none",
      boxShadow: "0 0 0 3px rgba(80, 128, 190, 0.1)",
    },
    label: {
      display: "block",
      textAlign: "left",
      fontWeight: 600,
      color: "#4b5563", // Updated from #1d5e9e (gray-600)
      marginBottom: "5px",
      fontSize: "14px",
    },
    timeField: {
      display: "flex",
      flexDirection: "column",
      width: "50%",
    },
    timeFields: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
    },
    button: {
      width: "100%",
      height: "40px",
      padding: "10px",
      border: "none",
      backgroundColor: "#5080BE", // Updated from #1d5e9e
      color: "#fff",
      fontWeight: 600,
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "10px",
      fontSize: "20px",
      transition: "background-color 0.2s",
    },
    buttonHover: {
      backgroundColor: "#3d6aa2", // Darker shade for hover
    },
    imgBg: {
      width: "50%",
      backgroundColor: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      position: "relative",
    },
    imgBgImg: {
      width: "90%",
      borderRadius: "20px",
    },
    popup: {
      display: "none",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
    },
    popupBox: {
      background: "#fff",
      borderRadius: "30px",
      width: "1000px",
      padding: "40px 20px",
      textAlign: "center",
      position: "relative",
      animation: "fadeIn 0.3s ease",
      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)", // Softer shadow
    },
    close: {
      position: "absolute",
      top: "15px",
      right: "20px",
      fontSize: "24px",
      fontWeight: "bold",
      cursor: "pointer",
      color: "#6b7280", // Updated to gray-500
      transition: "color 0.2s",
    },
    closeHover: {
      color: "#374151", // gray-700
    },
    profilePic: {
      width: "150px",
      height: "150px",
      backgroundColor: "#f3f4f6", // Updated from #d3d3d3 (gray-100)
      borderRadius: "50%",
      margin: "0 auto 25px",
      objectFit: "cover",
      border: "4px solid #e5e7eb", // Added subtle border
    },
    popupBoxH3: {
      color: "#5080BE", // Updated from #1d5e9e
      marginBottom: "10px",
      fontSize: "50px",
      fontWeight: 700,
    },
    popupBoxP: {
      fontSize: "20px",
      margin: "6px 0",
      color: "#4b5563", // gray-600
    },
    statusConnected: {
      textAlign: "center",
      marginBottom: "10px",
      padding: "8px",
      backgroundColor: "#dbeafe", // blue-100
      borderRadius: "5px",
      fontSize: "14px",
      color: "#1e40af", // blue-800
      border: "1px solid #bfdbfe", // blue-200
    },
    statusDisconnected: {
      textAlign: "center",
      marginBottom: "10px",
      padding: "8px",
      backgroundColor: "#fee2e2", // red-100
      borderRadius: "5px",
      fontSize: "14px",
      color: "#991b1b", // red-800
      border: "1px solid #fecaca", // red-200
    },
  };

  useEffect(() => {
    // Connect to WebSocket server
    const socket = new WebSocket("ws://localhost:8080/rfid");

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnectionStatus("Connected");
    };

    socket.onmessage = (event) => {
      // Ignore new scans while processing
      if (isProcessingRef.current) {
        console.log("⏳ Still processing previous scan, ignoring...");
        return;
      }

      try {
        isProcessingRef.current = true; // Lock processing

        const data = JSON.parse(event.data);
        setRfidData(data);

        // Prepare popup data
        const popupInfo = {
          name: data.name || "",
          id: data.rfid || "",
          message: data.message || "",
          date: new Date().toISOString().split("T")[0],
          timeIn: data.timeIn ? data.timeIn : " - ",
          timeOut: data.timeOut ? data.timeOut : " - ",
          showTimeOut: data.type === "time_out",
        };

        setPopupData(popupInfo);
        setShowPopup(true);

        // Auto-close popup after 5 seconds
        setTimeout(() => {
          setShowPopup(false);
          setRfidData({
            employee_id: "",
            name: "",
            timestamp: "",
            timeIn: " - ",
            timeOut: " - ",
          });
          isProcessingRef.current = false; // Unlock after popup closes
        }, 5000);
      } catch (error) {
        console.error("Error processing RFID:", error);
        isProcessingRef.current = false; // Unlock on error
      }
    };

    socket.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
      setConnectionStatus("Error");
    };

    socket.onclose = () => {
      console.log("❌ WebSocket closed");
      setConnectionStatus("Disconnected");
    };

    return () => socket.close();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = {
      name: form.empName.value,
      message: form.empMessage?.value || "",
      date: form.date.value,
      timeIn: form.timeIn.value,
      timeOut: form.timeOut.value,
      showTimeOut: !!form.timeOut.value,
    };

    setPopupData(formData);
    setShowPopup(true);

    // Reset form
    form.reset();
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div style={styles.body}>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          input:focus {
            border-color: #5080BE !important;
            outline: none;
            box-shadow: 0 0 0 3px rgba(80, 128, 190, 0.1);
          }
          
          button:hover {
            background-color: #3d6aa2 !important;
          }
          
          .close:hover {
            color: #374151 !important;
          }
          
          @media (max-width: 768px) {
            .body {
              background-position: center;
              flex-direction: column;
            }
            .attendance {
              width: 100%;
              padding: 20px;
            }
            .logo img {
              width: 120px;
              height: 110px;
            }
            .logo h1 {
              font-size: 28px;
            }
            .form {
              margin-left: 0;
            }
            .title {
              font-size: 22px;
            }
            .attend_form input {
              font-size: 14px;
            }
            button {
              font-size: 16px;
              height: 38px;
            }
            .popup-box {
              width: 300px;
              padding: 30px 15px;
            }
            .popup-box h3 {
              font-size: 24px;
            }
            .popup-box p {
              font-size: 16px;
            }
          }
          
          @media (max-width: 480px) {
            .logo {
              flex-direction: column;
              text-align: center;
            }
            .logo img {
              width: 100px;
              height: 90px;
            }
            .logo h1 {
              font-size: 24px;
            }
            .title {
              font-size: 20px;
            }
            label {
              font-size: 13px;
            }
            button {
              font-size: 14px;
            }
            .popup-box {
              width: 250px;
            }
          }
        `}
      </style>
      <div className="attendance" style={styles.attendance}>
        <div className="logo" style={styles.logo}>
          <img
            src="/images/vetlogo.png"
            alt="Fur Ever Logo"
            style={styles.logoImg}
          />
          <h1 style={styles.logoH1}>FUR EVER</h1>
        </div>

        <div className="form" style={styles.form}>
          <h2 className="title" style={styles.title}>
            Employee Attendance
          </h2>

          {/* WebSocket Status Indicator */}
          <div
            style={
              connectionStatus === "Connected"
                ? styles.statusConnected
                : styles.statusDisconnected
            }
          >
            <strong>RFID Status:</strong> {connectionStatus}
          </div>

          <form className="attend_form" onSubmit={handleSubmit}>
            <input
              type="text"
              id="empName"
              name="empName"
              placeholder="Employee Name"
              required
              value={rfidData ? rfidData.name : ""}
              onChange={(e) =>
                setRfidData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              style={styles.input}
            />
            <label htmlFor="date" style={styles.label}>
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={rfidData ? rfidData.timestamp.split(" ")[0] : ""}
              onChange={(e) =>
                setRfidData((prev) => ({
                  ...prev,
                  timestamp: e.target.value,
                }))
              }
              style={styles.input}
            />
            <div className="time-fields" style={styles.timeFields}>
              <div className="time-field" style={styles.timeField}>
                <label htmlFor="timeIn" style={styles.label}>
                  Time In
                </label>
                <input
                  type="text"
                  id="timeIn"
                  name="timeIn"
                  required
                  value={rfidData ? rfidData.timeIn : " - "}
                  onChange={(e) =>
                    setRfidData((prev) => ({
                      ...prev,
                      timeIn: e.target.value,
                    }))
                  }
                  style={{ ...styles.input, width: "100%" }}
                />
              </div>
              <div className="time-field" style={styles.timeField}>
                <label htmlFor="timeOut" style={styles.label}>
                  Time Out
                </label>
                <input
                  id="timeOut"
                  name="timeOut"
                  value={rfidData ? rfidData.timeOut : ""}
                  onChange={(e) =>
                    setRfidData((prev) => ({
                      ...prev,
                      timeOut: e.target.value,
                    }))
                  }
                  style={{ ...styles.input, width: "100%" }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="img_bg" style={styles.imgBg}>
        <img src="/images/b.PNG" alt="background" style={styles.imgBgImg} />
      </div>

      {/* Popup - Now controlled by React state */}
      {showPopup && popupData && (
        <div className="popup" style={{ ...styles.popup, display: "flex" }}>
          <div className="popup-box" style={styles.popupBox}>
            <span className="close" onClick={closePopup} style={styles.close}>
              &times;
            </span>
            <img
              className="profile-pic"
              src={
                rfidData
                  ? `http://localhost/VET-SUPER-SYSTEM-3E/HR/backend/${rfidData.photo}`
                  : ""
              }
              alt="No photo"
              style={styles.profilePic}
            />
            <h3 style={styles.popupBoxH3}>{popupData.name}</h3>
            <p
              style={{
                color: "#5080BE",
                fontWeight: "600",
                fontSize: "18px",
                marginBottom: "15px",
              }}
              dangerouslySetInnerHTML={{ __html: popupData.message }}
            ></p>
            <p style={styles.popupBoxP}>
              <strong>Date:</strong> <span>{popupData.date}</span>
            </p>
            <p style={styles.popupBoxP}>
              <strong>Time In:</strong> <span>{popupData.timeIn}</span>
            </p>
            <p style={styles.popupBoxP}>
              <strong>Time Out:</strong>{" "}
              <span>{popupData.timeOut ? popupData.timeOut : " - "}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
