// detectors/useeffect.js
import fs from "fs";
import path from "path";
import ts from "typescript";

export async function runUseEffectDetector(basePath) {
  const results = [];

  function analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, "utf8");
    const sf = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

    ts.forEachChild(sf, function visit(node) {
      if (ts.isCallExpression(node) && node.expression.getText(sf) === "useEffect") {
        const args = node.arguments;
        if (args.length === 2 && args[1].getText(sf) === "[]") {
          results.push({
            file: path.relative(basePath, filePath),
            pattern: "useEffect Dependency Issue",
            details: "Empty dependency array detected — may miss updates.",
          });
        }
      }
      ts.forEachChild(node, visit);
    });
  }

  function getAllFiles(dir, arr = []) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      fs.statSync(p).isDirectory() ? getAllFiles(p, arr) : /\.(jsx?|tsx?)$/.test(f) && arr.push(p);
    }
    return arr;
  }

  getAllFiles(basePath).forEach(analyzeFile);
  console.log(`✅ useEffect Detector found ${results.length} issues.`);
  return results;
}