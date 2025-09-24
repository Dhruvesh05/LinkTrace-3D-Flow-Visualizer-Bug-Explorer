import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { ESLint } from "eslint";
import { exec } from "child_process";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

const allowedExtensions = [".js", ".jsx", ".ts", ".tsx", ".py", ".c", ".cpp", ".java"];
const blockedFiles = [
  "package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
  "tsconfig.json", "next.config.js", "vite.config.js", "webpack.config.js",
  ".gitignore", "README.md"
];

// ESLint instance
const eslint = new ESLint();

// Dependency parser for JS/TS
function parseDependencies(content) {
  const regex = /(?:import .* from ['"](.+)['"]|require\(['"](.+)['"]\))/g;
  const deps = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    deps.push(match[1] || match[2]);
  }
  return deps;
}

function resolveDep(dep, files) {
  if (!dep.startsWith(".") && !dep.startsWith("/")) return null;
  let base = path.basename(dep);
  const possibleNames = [
    base, base + ".js", base + ".jsx", base + ".ts", base + ".tsx"
  ];
  return files.find(f => possibleNames.includes(f.originalname));
}

// Run ESLint for JS/TS files
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

// Run Python lint using pyflakes
function lintPython(file) {
  return new Promise((resolve) => {
    const filePath = path.join("./temp", file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    exec(`pyflakes "${filePath}"`, (err, stdout) => {
      const errors = stdout
        .split("\n")
        .filter(line => line)
        .map(line => ({ message: line }));
      fs.unlinkSync(filePath);
      resolve(errors);
    });
  });
}

// Run C/C++ lint using gcc/clang
function lintC(file) {
  return new Promise((resolve) => {
    const filePath = path.join("./temp", file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    exec(`gcc -fsyntax-only "${filePath}"`, (err, stdout, stderr) => {
      const errors = stderr
        .split("\n")
        .filter(line => line)
        .map(line => ({ message: line }));
      fs.unlinkSync(filePath);
      resolve(errors);
    });
  });
}

// Run Java lint using javac
function lintJava(file) {
  return new Promise((resolve) => {
    const filePath = path.join("./temp", file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    exec(`javac "${filePath}"`, (err, stdout, stderr) => {
      const errors = stderr
        .split("\n")
        .filter(line => line)
        .map(line => ({ message: line }));
    fs.unlinkSync(filePath);
    resolve(errors);
    });
  });
}

// Ensure temp folder exists
if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No files uploaded" });

    const files = req.files.filter(f =>
      allowedExtensions.includes(path.extname(f.originalname)) &&
      !blockedFiles.includes(f.originalname)
    );

    const nodes = [];
    const links = [];
    const bugData = { files: [] };

    // Add nodes
    files.forEach(file => nodes.push({ id: file.originalname }));

    // Build dependency links for JS/TS
    const jsFiles = files.filter(f => [".js", ".jsx", ".ts", ".tsx"].includes(path.extname(f.originalname)));
    jsFiles.forEach(file => {
      const content = file.buffer.toString("utf-8");
      const deps = parseDependencies(content);
      deps.forEach(dep => {
        const depFile = resolveDep(dep, jsFiles);
        if (depFile) links.push({ source: file.originalname, target: depFile.originalname });
      });
    });

    // Lint each file
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
    console.error("Upload error:", err.message);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
