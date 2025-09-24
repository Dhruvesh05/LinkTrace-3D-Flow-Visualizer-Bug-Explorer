'use client';
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef(null);

  const handleFiles = (fileList) => {
    const acceptedExtensions = [".js", ".ts", ".jsx", ".tsx"];
    const newFiles = Array.from(fileList)
      .filter(file => acceptedExtensions.some(ext => file.name.endsWith(ext)))
      .map(file => ({ file, path: file.webkitRelativePath || file.name }));
    setFiles(newFiles);
  };

  const handleFileInput = (e) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);

    const formData = new FormData();
    files.forEach(({ file, path }) => formData.append("files", file, path));

    try {
      const res = await fetch("http://localhost:5000/upload", { method: "POST", body: formData });
      const data = await res.json();
      localStorage.setItem("graphData", JSON.stringify(data));
      router.push("/visualizer");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setUploading(false);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Upload Selective Files</h1>
      <input type="file" multiple ref={fileInputRef} style={{ display: "none" }} onChange={handleFileInput} />
      <button onClick={() => fileInputRef.current.click()}>Browse Files</button>
      <button onClick={handleUpload} disabled={uploading}>{uploading ? "Uploading..." : "Start Visualization"}</button>

      {files.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Selected Files:</h3>
          <ul>
            {files.map((f, i) => <li key={i}>{f.file.name}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
