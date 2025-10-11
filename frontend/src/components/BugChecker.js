'use client';
import React, { useState } from "react";

export default function BugChecker({ files }) {
  const [result, setResult] = useState("");
  const [errorLog, setErrorLog] = useState([]);

  const handleCheck = async () => {
    if (!files || files.length === 0) {
      setResult("⚠ No files selected");
      setErrorLog(["Please upload files to check for bugs."]);
      return;
    }

    try {
      // Send only the selected files (filtered by extension) for bug checking
      const formData = new FormData();
      files.forEach(f => formData.append("files", f.file, f.path));

      const response = await fetch("http://localhost:5000/upload", { 
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!data || !data.files) {
        setResult("⚠ Bug check failed");
        setErrorLog(["No data received from backend"]);
        return;
      }

      const hasBugs = data.files.some(f => f.errors.length > 0);
      setResult(hasBugs ? "Bug(s) Found ❌" : "No Bugs ✅");

      const logs = [];
      data.files.forEach(f => {
        if (f.errors.length > 0) {
          f.errors.forEach(err => {
            logs.push(
              `File: ${f.name} | Line ${err.line || "-"}, Col ${err.column || "-"}: ${err.message || err} ${err.ruleId ? `(${err.ruleId})` : ""}`
            );
          });
        } else {
          logs.push(`File: ${f.name} - No bugs ✅`);
        }
      });
      setErrorLog(logs);

    } catch (err) {
      setResult("❌ Error connecting to server");
      setErrorLog(["❌ Could not reach backend"]);
      console.error(err);
    }
  };

  return (
    <div style={{ 
      display: "flex", flexDirection: "column", gap: "20px", 
      maxWidth: "900px", margin: "50px auto", padding: "30px", 
      borderRadius: "16px", background: "linear-gradient(135deg, #f9f9f9, #ececec)", 
      boxShadow: "0px 6px 15px rgba(0,0,0,0.1)" 
    }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>🔍 AI Bug Detector</h2>

      <button 
        onClick={handleCheck} 
        style={{
          padding: "12px 20px",
          borderRadius: "8px",
          border: "none",
          background: "#0070f3",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.3s"
        }}
        onMouseOver={(e) => e.target.style.background = "#0051a8"}
        onMouseOut={(e) => e.target.style.background = "#0070f3"}
      >
        Check Selected Files for Bugs
      </button>

      <div style={{ 
        padding: "15px", 
        borderRadius: "10px", 
        background: result.includes("Bug") ? "#ffe6e6" : "#e6ffe6",
        border: result.includes("Bug") ? "1px solid #ff4d4d" : "1px solid #33cc33"
      }}>
        <h3>Result: {result}</h3>
      </div>

      <div style={{ 
        padding: "15px", 
        borderRadius: "10px", 
        background: "#fafafa", 
        border: "1px solid #ddd",
        maxHeight: "400px",
        overflowY: "auto"
      }}>
        <h3 style={{ marginBottom: "10px" }}>📝 Error Section</h3>
        {errorLog.length > 0 ? (
          <ul>
            {errorLog.map((err, i) => (
              <li key={i} style={{ color: err.includes("❌") || err.includes("Bug") ? "red" : "green", fontSize: "0.9rem" }}>
                {err}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#777" }}>No errors logged yet</p>
        )}
      </div>
    </div>
  );
}
