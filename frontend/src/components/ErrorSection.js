'use client';
import React from "react";

export default function ErrorSection({ data }) {
  if (!data || !data.files || data.files.length === 0)
    return (
      <p style={{ 
        color: "#dc2626",
        fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
        fontWeight: "600",
        textAlign: "center",
        padding: "clamp(1rem, 2vw, 1.5rem)",
        background: "#fee2e2",
        border: "3px solid #ef4444",
        borderRadius: "0",
        margin: "clamp(1.5rem, 3vw, 2rem) auto",
        maxWidth: "min(95%, 600px)"
      }}>
        ⚠ No bug data available
      </p>
    );

  const hasBug = data.files.some(f => f.errors.length > 0);

  return (
    <div style={{
      marginTop: "clamp(2rem, 4vw, 3rem)",
      padding: "clamp(1.5rem, 3vw, 2.5rem)",
      background: "#ffffff",
      borderRadius: "0",
      border: "3px solid #e2e8f0",
      boxShadow: "0 4px 20px rgba(15, 23, 42, 0.08)",
      maxWidth: "min(95%, 1000px)",
      margin: "clamp(2rem, 4vw, 3rem) auto",
      position: "relative",
      color: "#0f172a"
    }}>
      <h2 style={{ 
        marginBottom: "clamp(1.25rem, 3vw, 1.75rem)",
        marginTop: "0",
        fontSize: "clamp(1.5rem, 4vw, 2rem)",
        fontWeight: "700",
        color: "#0f172a",
        letterSpacing: "-0.5px",
        paddingLeft: 0
      }}>
        🛑 Bug Detection Results
      </h2>

      {data.files.map((file, idx) => (
        <div key={idx} style={{
          marginBottom: "clamp(1rem, 2vw, 1.5rem)",
          padding: "clamp(1rem, 2.5vw, 1.5rem)",
          background: file.errors.length > 0 ? "#fef2f2" : "#f0fdf4",
          borderRadius: "0",
          border: file.errors.length > 0 ? "2px solid #fecaca" : "2px solid #bbf7d0",
          transition: "all 0.3s ease",
          boxShadow: file.errors.length > 0 
            ? "0 2px 10px rgba(239, 68, 68, 0.1)" 
            : "0 2px 10px rgba(34, 197, 94, 0.1)"
        }}>
          <strong style={{
            fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
            color: file.errors.length > 0 ? "#991b1b" : "#166534",
            fontWeight: "700"
          }}>
            {file.name}:
          </strong>
          {file.errors.length > 0 ? (
            <ul style={{ 
              marginTop: "clamp(0.75rem, 2vw, 1rem)",
              marginBottom: "0",
              paddingLeft: "clamp(1.25rem, 3vw, 1.75rem)",
              listStyle: "none"
            }}>
              {file.errors.map((err, i) => (
                <li key={i} style={{ 
                  color: "#dc2626", 
                  fontSize: "clamp(0.85rem, 1.8vw, 0.95rem)",
                  lineHeight: "1.6",
                  marginBottom: "0.5rem",
                  paddingLeft: "1.25rem",
                  position: "relative",
                  fontWeight: "500"
                }}>
                  <span style={{
                    position: "absolute",
                    left: "0",
                    top: "0.5em",
                    width: "6px",
                    height: "6px",
                    background: "#dc2626",
                    borderRadius: "0"
                  }} />
                  {err.line ? `Line ${err.line}, Col ${err.column || "-"}: ` : ""}
                  {err.message || err}
                  {err.ruleId ? ` (${err.ruleId})` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <span style={{ 
              color: "#16a34a", 
              marginLeft: "clamp(0.5rem, 1vw, 0.75rem)",
              fontSize: "clamp(0.9rem, 2vw, 1rem)",
              fontWeight: "600"
            }}>
              No bugs ✅
            </span>
          )}
        </div>
      ))}

      <hr style={{ 
        margin: "clamp(1.5rem, 3vw, 2rem) 0",
        border: "none",
        borderTop: "3px solid #e2e8f0"
      }} />
      <h3 style={{
        fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0",
        textAlign: "center"
      }}>
        Overall Status:{" "}
        {hasBug ? (
          <span style={{ 
            color: "#dc2626",
            padding: "0.5rem 1rem",
            background: "#fee2e2",
            border: "2px solid #ef4444",
            borderRadius: "0",
            display: "inline-block",
            marginLeft: "0.5rem",
            fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)"
          }}>
            Bug(s) Found ❌
          </span>
        ) : (
          <span style={{ 
            color: "#16a34a",
            padding: "0.5rem 1rem",
            background: "#dcfce7",
            border: "2px solid #22c55e",
            borderRadius: "0",
            display: "inline-block",
            marginLeft: "0.5rem",
            fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)"
          }}>
            No Bugs ✅
          </span>
        )}
      </h3>
    </div>
  );
}