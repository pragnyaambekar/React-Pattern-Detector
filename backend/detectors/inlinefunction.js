
import fs from "fs";
import path from "path";

export async function runInlineFunctionDetector(basePath) {
  const results = [];

  function analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, "utf8");
    const regex = /on\w+\s*=\s*\{.*=>.*\}/g; // finds inline event handlers
    const matches = [...code.matchAll(regex)];

    for (const match of matches) {
      const lineNumber = code.substring(0, match.index).split("\n").length;
      results.push({
        file: path.basename(filePath),
        pattern: "Inline Function Definition",
        details: `Inline function found at line ${lineNumber}: ${match[0].split("=")[0].trim()}`,
      });
    }
  }

  function getAllFiles(dirPath, arr = []) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) getAllFiles(fullPath, arr);
      else if (/\.(jsx?|tsx?)$/.test(file)) arr.push(fullPath);
    }
    return arr;
  }

  const files = getAllFiles(basePath);
  files.forEach((file) => analyzeFile(file));

  return results;
}
