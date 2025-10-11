import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });
const allowedExtensions = [".js", ".ts", ".jsx", ".tsx", ".py", ".java", ".c", ".cpp"];

// Parse functions from file based on extension
function parseFunctions(filePath, ext) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const functions = [];

  if ([".js", ".ts", ".jsx", ".tsx"].includes(ext)) {
    lines.forEach(line => {
      line = line.trim();
      let match = line.match(/function\s+(\w+)\s*\(/);
      if (match) functions.push(match[1]);
      match = line.match(/const\s+(\w+)\s*=\s*\(.*\)\s*=>/);
      if (match) functions.push(match[1]);
    });
  } else if (ext === ".py") {
    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith("def ")) functions.push(line.split(" ")[1].split("(")[0]);
    });
  } else if (ext === ".java") {
    lines.forEach(line => {
      const match = line.match(/(public|private|protected)?\s+\w+\s+(\w+)\s*\(/);
      if (match) functions.push(match[2]);
    });
  } else if ([".c", ".cpp"].includes(ext)) {
    lines.forEach(line => {
      const match = line.match(/(\w+)\s+(\w+)\s*\(.*\)\s*\{/);
      if (match) functions.push(match[2]);
    });
  }

  return functions;
}

app.post("/upload", upload.array("files"), (req, res) => {
  const nodes = [];
  const links = [];

  req.files.forEach(file => {
    const ext = path.extname(file.originalname);
    if (!allowedExtensions.includes(ext)) return;

    const functions = parseFunctions(file.path, ext);

    nodes.push({
      id: file.originalname,
      functions
    });

    // Optional: create links between files and functions (can expand later)
    functions.forEach(fn => {
      links.push({ source: file.originalname, target: fn });
    });
  });

  res.json({ graphData: { nodes, links } });
});

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
