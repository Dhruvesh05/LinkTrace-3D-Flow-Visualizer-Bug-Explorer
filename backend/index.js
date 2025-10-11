import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import { ESLint } from "eslint";
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app = express();

// Port
const PORT = process.env.PORT || 5000;

// Setup CORS for multiple origins
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",")
  : [];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: Origin ${origin} not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

// Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Allowed extensions & blocked files
const allowedExtensions = [".js", ".jsx", ".ts", ".tsx", ".py", ".c", ".cpp", ".java"];
const blockedFiles = [
  "package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
  "tsconfig.json", "next.config.js", "vite.config.js", "webpack.config.js",
  ".gitignore", "README.md"
];

// ESLint setup
const eslint = new ESLint();

// Ensure temp folder exists
const TEMP_DIR = "./temp";
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

// Parse functions (optional)
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

// Linting functions
async function lintJS(file) {
  const content = file.buffer.toString("utf-8");
  const results = await eslint.lintText(content, { filePath: file.originalname });
  return results[0].messages.map(msg => ({
    line: msg.line,
    column: msg.column,
    severity: msg.severity === 2 ? "Error" : "Warning",
    message: msg.message,
    ruleId: msg.ruleId
  }));
}

function lintPython(file) {
  return new Promise(resolve => {
    const filePath = path.join(TEMP_DIR, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    exec(`pyflakes "${filePath}"`, (err, stdout) => {
      const errors = stdout.split("\n").filter(Boolean).map(line => ({ message: line }));
      fs.unlinkSync(filePath);
      resolve(errors);
    });
  });
}

function lintC(file) {
  return new Promise(resolve => {
    const filePath = path.join(TEMP_DIR, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    exec(`gcc -fsyntax-only "${filePath}"`, (err, stdout, stderr) => {
      const errors = stderr.split("\n").filter(Boolean).map(line => ({ message: line }));
      fs.unlinkSync(filePath);
      resolve(errors);
    });
  });
}

function lintJava(file) {
  return new Promise(resolve => {
    const filePath = path.join(TEMP_DIR, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    exec(`javac "${filePath}"`, (err, stdout, stderr) => {
      const errors = stderr.split("\n").filter(Boolean).map(line => ({ message: line }));
      fs.unlinkSync(filePath);
      resolve(errors);
    });
  });
}

// Upload endpoint
app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "No files uploaded" });

    const files = req.files.filter(f =>
      allowedExtensions.includes(path.extname(f.originalname)) &&
      !blockedFiles.includes(f.originalname)
    );

    const nodes = files.map(f => ({ id: f.originalname }));
    const links = [];

    // JS/TS import links
    const jsFiles = files.filter(f => [".js", ".jsx", ".ts", ".tsx"].includes(path.extname(f.originalname)));
    jsFiles.forEach(file => {
      const content = file.buffer.toString("utf-8");
      const regex = /(?:import .* from ['"](.+)['"]|require\(['"](.+)['"]\))/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const depName = match[1] || match[2];
        const depFile = jsFiles.find(f2 =>
          f2.originalname === depName || f2.originalname === depName + ".js"
        );
        if (depFile) links.push({ source: file.originalname, target: depFile.originalname });
      }
    });

    // Lint all files
    const bugData = { files: [] };
    for (const file of files) {
      const ext = path.extname(file.originalname);
      let errors = [];
      if ([".js", ".jsx", ".ts", ".tsx"].includes(ext)) errors = await lintJS(file);
      else if (ext === ".py") errors = await lintPython(file);
      else if ([".c", ".cpp"].includes(ext)) errors = await lintC(file);
      else if (ext === ".java") errors = await lintJava(file);
      bugData.files.push({ name: file.originalname, errors });
    }

    res.json({ graphData: { nodes, links }, bugData });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
