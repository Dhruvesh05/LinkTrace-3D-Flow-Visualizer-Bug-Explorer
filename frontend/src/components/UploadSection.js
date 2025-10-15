'use client';
import React, { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import ErrorSection from "./ErrorSection";
import "./UploadSection.css";

// Dynamic import for 3D visualizer (avoids SSR crash)
const CodeGraphVisualizer = dynamic(() => import("./CodeGraphVisualizer"), { ssr: false });

// Backend endpoint setup
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function UploadSection() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [bugData, setBugData] = useState(null);
  const fileInputRef = useRef(null);

  const acceptedExtensions = [".js", ".ts", ".jsx", ".tsx", ".java", ".cpp", ".c", ".py"];
  const langColor = {
    js: "#1e3a8a",
    ts: "#0ea5e9",
    py: "#16a34a",
    cpp: "#f97316",
    c: "#fb923c",
    java: "#eab308",
    jsx: "#7c3aed",
    tsx: "#0d9488",
  };

  // ✅ Add new files to state safely
  const addFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList)
      .filter(f => acceptedExtensions.some(ext => f.name.endsWith(ext)))
      .map(f => ({
        file: f,
        name: f.name,
        path: f.webkitRelativePath || f.name,
        size: f.size,
        ext: f.name.split(".").pop().toLowerCase()
      }));

    setFiles(prev => {
      const existingPaths = new Set(prev.map(f => f.path));
      return [...prev, ...newFiles.filter(f => !existingPaths.has(f.path))];
    });
  }, [acceptedExtensions]);

  const handleFileInput = e => e.target.files && addFiles(e.target.files);

  // ✅ Recursive folder traversal
  const traverseFileTree = useCallback((entry, pathPrefix = "") => {
    const ignoredFolders = ["node_modules", ".git", "dist", "build"];
    return new Promise(resolve => {
      if (entry.isFile) {
        entry.file(file => resolve([{
          file,
          path: pathPrefix + file.name,
          size: file.size,
          name: file.name,
          ext: file.name.split(".").pop().toLowerCase()
        }]));
      } else if (entry.isDirectory) {
        if (ignoredFolders.includes(entry.name)) return resolve([]);
        const dirReader = entry.createReader();
        dirReader.readEntries(async entries => {
          const filesPromises = entries.map(e => traverseFileTree(e, pathPrefix + entry.name + "/"));
          const results = await Promise.all(filesPromises);
          resolve(results.flat());
        });
      }
    });
  }, []);

  // ✅ Handle folder drag-drop
  const handleDrop = useCallback(async e => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    if (!items) return;

    const allFiles = [];
    for (const item of items) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        const filesFromEntry = await traverseFileTree(entry);
        allFiles.push(...filesFromEntry);
      }
    }
    addFiles(allFiles);
  }, [addFiles, traverseFileTree]);

  const removeFile = i => setFiles(prev => prev.filter((_, index) => index !== i));

  // ✅ Upload and process visualization + bug data
  const handleUpload = async () => {
    if (!files.length) return alert("Please select files or a folder before uploading.");
    setUploading(true);
    setGraphData(null);
    setBugData(null);

    const formData = new FormData();
    files.forEach(({ file, path }) => formData.append("files", file, path));

    try {
      const res = await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      const data = await res.json();

      // Set both visualization and bug report data
      setGraphData(data.graphData || null);
      setBugData(data.bugData || null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert(`Upload failed: ${err.message}`);
    }

    setUploading(false);
  };

  return (
    <div className="upload-wrapper" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
      <div className="upload-container">
        <h1>📁 Upload Files / Folders</h1>
        <p>Upload your project to visualize code connections and detect bugs instantly.</p>

        {/* Drop Zone */}
        <div className="upload-dropzone" onClick={() => fileInputRef.current.click()}>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            webkitdirectory="true"
            onChange={handleFileInput}
            className="hidden-input"
          />
          <div className="upload-prompt">
            <span>📂</span>
            <h2>Drag & Drop or Click</h2>
            <p>Supported: {acceptedExtensions.join(", ")}</p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="file-list">
            {files.map((f, i) => (
              <div key={i} className="file-item" style={{ background: langColor[f.ext] || "#334155" }}>
                <span>{f.path}</span>
                <span>{(f.size / 1024).toFixed(2)} KB</span>
                <button onClick={() => removeFile(i)}>✖</button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <button className="upload-btn" onClick={handleUpload} disabled={uploading || !files.length}>
          {uploading ? "Uploading & Analyzing..." : "Start Visualization"}
        </button>

        {/* Graph Visualizer */}
        {graphData && (
          <>
            <hr style={{ margin: "2rem 0", border: "1px solid #e2e8f0" }} />
            <CodeGraphVisualizer graphData={graphData} />
          </>
        )}

        {/* Bug Detection Section */}
        {bugData && (
          <>
            <hr style={{ margin: "2rem 0", border: "1px solid #e2e8f0" }} />
            <ErrorSection data={bugData} />
          </>
        )}
      </div>
    </div>
  );
}
