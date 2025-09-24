import { useState } from "react";

export default function BugChecker() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [errorLog, setErrorLog] = useState([]);

  const handleCheck = async () => {
    try {
      const response = await fetch("http://localhost:5000/upload-single", { // or your endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name: "Snippet.js" }),
      });

      const data = await response.json();

      if (data.errors) {
        if (data.errors.length === 0) {
          setResult("No Bugs ✅");
          setErrorLog(["✅ No errors found"]);
        } else {
          setResult("Bug(s) Found ❌");
          const logs = data.errors.map(
            (err) => `Line ${err.line}, Col ${err.column}: ${err.message} (${err.ruleId})`
          );
          setErrorLog(logs);
        }
      } else {
        setResult("Prediction failed ⚠️");
        setErrorLog(["⚠️ ESLint could not parse the code"]);
      }
    } catch (err) {
      setResult("❌ Error connecting to server");
      setErrorLog(["❌ Could not reach backend"]);
    }
  };

  return (
    <div style={{ 
      display: "flex", flexDirection: "column", gap: "20px", 
      maxWidth: "800px", margin: "50px auto", padding: "30px", 
      borderRadius: "16px", background: "linear-gradient(135deg, #f9f9f9, #ececec)", 
      boxShadow: "0px 6px 15px rgba(0,0,0,0.1)" 
    }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>🔍 AI Bug Detector</h2>

      <textarea
        rows="8"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontFamily: "monospace",
          fontSize: "14px",
          resize: "none"
        }}
      />

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
        Check for Bugs
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
        border: "1px solid #ddd"
      }}>
        <h3 style={{ marginBottom: "10px" }}>📝 Error Section</h3>
        {errorLog.length > 0 ? (
          <ul>
            {errorLog.map((err, i) => (
              <li key={i} style={{ color: err.includes("❌") || err.includes("⚠️") ? "red" : "green" }}>{err}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#777" }}>No errors logged yet</p>
        )}
      </div>
    </div>
  );
}
