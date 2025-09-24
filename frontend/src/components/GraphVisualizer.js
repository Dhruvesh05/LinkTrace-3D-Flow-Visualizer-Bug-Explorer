'use client';
import React, { useState, useRef, useCallback } from "react";
import GraphVisualizer from "./GraphVisualizer";
import ErrorSection from "./ErrorSection";
import "./UploadSection.css";

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
    java: "#eab308"
  };

  // Merge new files into existing list
  const addFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList)
      .filter(file => acceptedExtensions.some(ext => file.name.endsWith(ext)))
      .map(file => ({
        file,
        name: file.name,
        path: file.webkitRelativePath || file.name,
        size: file.size,
        ext: file.name.split('.').pop().toLowerCase()
      }));

    setFiles(prev => {
      const existingPaths = new Set(prev.map(f => f.path));
      return [...prev, ...newFiles.filter(f => !existingPaths.has(f.path))];
    });
  }, []);

  // Handle file input
  const handleFileInput = (e) => {
    if (e.target.files) addFiles(e.target.files);
  };

  // Drag & drop folders/files
  const handleDrop = async (e) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    if (items) {
      const allFiles = [];
      for (const item of items) {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          const filesFromEntry = await traverseFileTree(entry);
          allFiles.push(...filesFromEntry);
        }
      }
      addFiles(allFiles);
    }
  };

  const traverseFileTree = (entry, pathPrefix = "") => {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file(file => resolve([{ file, path: pathPrefix + file.name, size: file.size, name: file.name, ext: file.name.split('.').pop().toLowerCase() }]));
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        dirReader.readEntries(async (entries) => {
          const filesPromises = entries.map(e => traverseFileTree(e, pathPrefix + entry.name + "/"));
          const results = await Promise.all(filesPromises);
          resolve(results.flat());
        });
      }
    });
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);

    const formData = new FormData();
    files.forEach(({ file, path }) => formData.append("files", file, path));

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Backend error: ${res.status} - ${text}`);
      }

      const data = await res.json();
      setGraphData(data.graphData);
      setBugData(data.bugData);
    } catch (err) {
      console.error("Upload failed:", err);
      alert(`Upload failed: ${err.message}`);
    }

    setUploading(false);
  };

  return (
    <div
      className="upload-wrapper"
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="upload-container">
        <div className="upload-header">
          <h1>Upload Files & Folders</h1>
          <p>Select multiple files or folders to visualize and check for bugs.</p>
        </div>

        <div
          className="upload-dropzone"
          onClick={() => fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            webkitdirectory="true"
            onChange={handleFileInput}
            className="hidden-input"
          />
          <div className="upload-prompt">
            <span className="upload-icon">📂</span>
            <h2>Drag & Drop or Click to Browse</h2>
            <p>Supported: {acceptedExtensions.join(", ")}</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="file-list">
            <h3>Selected Files/Folders:</h3>
            <div className="file-scroll">
              {files.map((f, i) => (
                <div key={i} className="file-item" style={{ background: langColor[f.ext] || "#334155" }}>
                  <div className="file-details">
                    <span className="file-name">{f.path}</span>
                    <span className="file-size">{(f.size / 1024).toFixed(2)} KB</span>
                  </div>
                  <button className="file-remove" onClick={() => removeFile(i)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="upload-btn-wrapper">
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={uploading || !files.length}
          >
            {uploading ? "Uploading..." : "Start Visualization"}
          </button>
        </div>

        {graphData && <GraphVisualizer graphData={graphData} />}
        {bugData && <ErrorSection data={bugData} />}
      </div>
    </div>
  );
}
