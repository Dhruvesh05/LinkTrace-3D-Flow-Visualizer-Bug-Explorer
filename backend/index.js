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

// ----------------------
// 🔍 Function Parser
// ----------------------
function parseFunctions(filePath, ext) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const functions = [];

  if ([".js", ".ts", ".jsx", ".tsx"].includes(ext)) {
    lines.forEach((line) => {
      line = line.trim();
      let match = line.match(/function\s+(\w+)\s*\(/);
      if (match) functions.push(match[1]);
      match = line.match(/const\s+(\w+)\s*=\s*\(.*\)\s*=>/);
      if (match) functions.push(match[1]);
    });
  } else if (ext === ".py") {
    lines.forEach((line) => {
      line = line.trim();
      if (line.startsWith("def ")) functions.push(line.split(" ")[1].split("(")[0]);
    });
  } else if (ext === ".java") {
    lines.forEach((line) => {
      const match = line.match(/(public|private|protected)?\s+\w+\s+(\w+)\s*\(/);
      if (match) functions.push(match[2]);
    });
  } else if ([".c", ".cpp"].includes(ext)) {
    lines.forEach((line) => {
      const match = line.match(/(\w+)\s+(\w+)\s*\(.*\)\s*\{/);
      if (match) functions.push(match[2]);
    });
  }

  return functions;
}

// ----------------------
// 🐞 Simple Bug Checker
// ----------------------
function detectBugs(filePath, ext) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const errors = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Detect TODO comments
    if (line.includes("TODO") || line.includes("FIXME")) {
      errors.push({
        line: lineNum,
        column: 0,
        message: "Contains TODO/FIXME comment",
        ruleId: "todo-comment",
      });
    }

    // Detect console.log in JS/TS
    if ([".js", ".ts", ".jsx", ".tsx"].includes(ext) && line.includes("console.log")) {
      errors.push({
        line: lineNum,
        column: line.indexOf("console.log"),
        message: "Unexpected console.log statement",
        ruleId: "no-console",
      });
    }

    // Detect unused imports (simple heuristic)
    if ([".js", ".ts", ".jsx", ".tsx"].includes(ext) && line.startsWith("import") && !line.includes("from")) {
      errors.push({
        line: lineNum,
        column: 0,
        message: "Possibly unused or incomplete import",
        ruleId: "incomplete-import",
      });
    }

    // Detect missing semicolons in JS-like files
    if ([".js", ".ts", ".jsx", ".tsx"].includes(ext) && line.trim().endsWith(")") && !line.trim().endsWith(");")) {
      errors.push({
        line: lineNum,
        column: line.length,
        message: "Missing semicolon at end of statement",
        ruleId: "missing-semicolon",
      });
    }

    // Detect long lines (common readability issue)
    if (line.length > 120) {
      errors.push({
        line: lineNum,
        column: 120,
        message: "Line exceeds 120 characters (consider breaking it)",
        ruleId: "max-len",
      });
    }
  });

  return errors;
}

// ----------------------
// 🚀 Upload Route
// ----------------------
app.post("/upload", upload.array("files"), (req, res) => {
  const nodes = [];
  const links = [];
  const bugData = { files: [] };

  req.files.forEach((file) => {
    const ext = path.extname(file.originalname);
    if (!allowedExtensions.includes(ext)) return;

    const functions = parseFunctions(file.path, ext);
    const errors = detectBugs(file.path, ext);

    nodes.push({
      id: file.originalname,
      functions,
    });

    // Create link from file -> function
    functions.forEach((fn) => {
      links.push({ source: file.originalname, target: fn });
    });

    // Collect bug info
    bugData.files.push({
      name: file.originalname,
      errors,
    });
  });

  // Cleanup uploaded files after processing
  req.files.forEach((file) => fs.unlinkSync(file.path));

  res.json({ graphData: { nodes, links }, bugData });
});

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
