import React, { useEffect, useState } from "react";

export default function LiveRFIDDisplay() {
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]); // store history of scans
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    // Connect to your WebSocket server
    const socket = new WebSocket("ws://localhost:8080/rfid");

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnectionStatus("Connected");
    };

    socket.onmessage = (event) => {
      try {
        const rfidData = JSON.parse(event.data);
        console.log("📩 Message received:", rfidData);
        setData(rfidData);
        setMessages((prev) => [rfidData, ...prev]); // add to top of history
      } catch (err) {
        console.error("❌ Failed to parse WebSocket message:", event.data);
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

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>RFID Live Monitor</h2>
      <p>Status: {connectionStatus}</p>

      {data ? (
        <div
          style={{
            border: "2px solid #333",
            borderRadius: 10,
            padding: 20,
            width: 350,
            margin: "auto",
            marginBottom: 20,
            backgroundColor: data.type === "time_in" ? "#d4edda" : "#f8d7da",
          }}
        >
          <h3>{data.name}</h3>
          <p>
            <strong>RFID:</strong> {data.rfid}
          </p>
          <p>
            <strong>Action:</strong> {data.type.toUpperCase()}
          </p>
          <p>
            <strong>Message:</strong> {data.message}
          </p>
          <small>{data.timestamp}</small>
        </div>
      ) : (
        <p>Waiting for RFID scans...</p>
      )}

      <hr style={{ width: "50%", margin: "20px auto" }} />

      <h3>Scan History</h3>
      <div>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
              backgroundColor: msg.type === "time_in" ? "#e2f7e1" : "#fde2e2",
            }}
          >
            <strong>{msg.name}</strong> ({msg.type.toUpperCase()}) <br />
            RFID: {msg.rfid} <br />
            {msg.message} <br />
            <small>{msg.timestamp}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
