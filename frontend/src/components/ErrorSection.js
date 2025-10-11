'use client';
import React from "react";

export default function ErrorSection({ data }) {
  if (!data || !data.files || data.files.length === 0) 
    return <p style={{ color: "red" }}>⚠ No bug data available</p>;

  const hasBug = data.files.some(f => f.errors.length > 0);

  return (
    <div style={{
      marginTop: "2rem",
      padding: "1rem",
      background: "#1e293b",
      borderRadius: "0.75rem",
      color: "white"
    }}>
      <h2 style={{ marginBottom: "1rem" }}>🛑 Bug Detection Results</h2>

      {data.files.map((file, idx) => (
        <div key={idx} style={{
          marginBottom: "1rem",
          padding: "0.5rem",
          background: "#334155",
          borderRadius: "0.5rem"
        }}>
          <strong>{file.name}:</strong>
          {file.errors.length > 0 ? (
            <ul style={{ marginTop: "0.5rem" }}>
              {file.errors.map((err, i) => (
                <li key={i} style={{ color: "red", fontSize: "0.9rem" }}>
                  {err.line ? `Line ${err.line}, Col ${err.column || "-"}: ` : ""}
                  {err.message || err}
                  {err.ruleId ? ` (${err.ruleId})` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <span style={{ color: "#34d399", marginLeft: "0.5rem" }}>No bugs ✅</span>
          )}
        </div>
      ))}

      <hr style={{ margin: "1rem 0", borderColor: "#64748b" }} />
      <h3>
        Overall Status:{" "}
        {hasBug ? (
          <span style={{ color: "#f87171" }}>Bug(s) Found ❌</span>
        ) : (
          <span style={{ color: "#34d399" }}>No Bugs ✅</span>
        )}
      </h3>
    </div>
  );
}
