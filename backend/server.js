import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import { ESLint } from "eslint";
import { exec } from "child_process";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Allowed file types
const allowedExtensions = [".js", ".ts", ".jsx", ".tsx", ".py", ".java", ".c", ".cpp"];
const blockedFiles = [
  "package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
  "tsconfig.json", "next.config.js", "vite.config.js", "webpack.config.js",
  ".gitignore", "README.md"
];

const eslint = new ESLint({ useEslintrc: true });

// JS/TS dependency extractor
function extractDependencies(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const regex = /import .* from ['"](.*)['"]/g;
  let match, deps = [];
  while ((match = regex.exec(content)) !== null) deps.push(match[1]);
  return deps;
}

// Python bug analysis
function analyzePython(filePath) {
  return new Promise(resolve => {
    exec(`pylint --output-format=json "${filePath}"`, (err, stdout) => {
      if (err) return resolve([{ message: "Python analysis failed" }]);
      try {
        const results = JSON.parse(stdout);
        const errors = results.map(msg => ({
          line: msg.line,
          column: msg.column,
          severity: msg.type === "error" ? "Error" : "Warning",
          message: msg.message,
          ruleId: msg.symbol
        }));
        resolve(errors);
      } catch {
        resolve([{ message: "Python analysis parse failed" }]);
      }
    });
  });
}

// Java bug analysis
function analyzeJava(filePath) {
  return new Promise(resolve => {
    exec(`java -jar checkstyle-10.12.3-all.jar -f json "${filePath}"`, (err, stdout) => {
      if (err) return resolve([{ message: "Java analysis failed" }]);
      try {
        const results = JSON.parse(stdout);
        const errors = results[0]?.errors?.map(msg => ({
          line: msg.line,
          column: msg.column,
          severity: msg.severity,
          message: msg.message,
          ruleId: msg.source
        })) || [];
        resolve(errors);
      } catch {
        resolve([{ message: "Java analysis parse failed" }]);
      }
    });
  });
}

// C/C++ bug analysis
function analyzeCpp(filePath) {
  return new Promise(resolve => {
    exec(`clang-tidy "${filePath}" -- -std=c++17`, (err, stdout) => {
      if (err) return resolve([{ message: "C/C++ analysis failed" }]);
      const lines = stdout.split("\n").filter(l => l.includes(": warning:") || l.includes(": error:"));
      const errors = lines.map(l => {
        const parts = l.split(":");
        return {
          line: Number(parts[1]),
          column: Number(parts[2]),
          severity: parts[3].includes("error") ? "Error" : "Warning",
          message: parts.slice(3).join(":").trim(),
          ruleId: "clang-tidy"
        };
      });
      resolve(errors);
    });
  });
}

// Upload route
app.post("/upload", upload.array("files"), async (req, res) => {
  const nodes = [];
  const links = [];
  const bugData = { files: [] };

  for (const file of req.files) {
    const relativePath = file.originalname.replace(/\\/g, "/");
    const ext = path.extname(relativePath);

    if (!allowedExtensions.includes(ext) || blockedFiles.includes(path.basename(relativePath))) {
      fs.unlinkSync(file.path);
      continue;
    }

    // JS/TS dependencies
    if ([".js", ".ts", ".jsx", ".tsx"].includes(ext)) {
      const deps = extractDependencies(file.path);
      deps.forEach(dep => links.push({ source: relativePath, target: dep }));
    }

    nodes.push({ id: relativePath });

    let errors = [];
    const content = fs.readFileSync(file.path, "utf-8");

    if ([".js", ".ts", ".jsx", ".tsx"].includes(ext)) {
      const results = await eslint.lintText(content, { filePath: relativePath });
      errors = results[0].messages.map(msg => ({
        line: msg.line,
        column: msg.column,
        severity: msg.severity === 2 ? "Error" : "Warning",
        message: msg.message,
        ruleId: msg.ruleId
      }));
    } else if (ext === ".py") {
      errors = await analyzePython(file.path);
    } else if (ext === ".java") {
      errors = await analyzeJava(file.path);
    } else if ([".c", ".cpp"].includes(ext)) {
      errors = await analyzeCpp(file.path);
    } else {
      errors = [{ message: "Unsupported file type" }];
    }

    bugData.files.push({ name: relativePath, errors });
  }

  res.json({ graphData: { nodes, links }, bugData });
});

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
