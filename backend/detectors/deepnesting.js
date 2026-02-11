// detectors/deepnesting.js
import fs from "fs";
import path from "path";
import ts from "typescript";

export async function runDeepNestingDetector(basePath) {
  const results = [];

  function getDepth(node, depth = 0) {
    if (!node) return depth;
    let max = depth;
    node.forEachChild((child) => {
      if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) {
        max = Math.max(max, getDepth(child, depth + 1));
      }
    });
    return max;
  }

  function analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, "utf8");
    const sf = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    let found = false;
    ts.forEachChild(sf, (node) => {
      if (ts.isFunctionDeclaration(node) || ts.isVariableStatement(node)) {
        const depth = getDepth(node);
        if (depth > 5 && !found) {
          results.push({
            file: path.relative(basePath, filePath),
            pattern: "Deep JSX Nesting",
            details: `Nesting depth = ${depth}`,
          });
          found = true;
        }
      }
    });
  }

  const files = [];
  function getAll(dir) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      fs.statSync(p).isDirectory() ? getAll(p) : /\.(jsx?|tsx?)$/.test(f) && files.push(p);
    }
  }

  getAll(basePath);
  files.forEach(analyzeFile);
  console.log(`✅ Deep Nesting Detector found ${results.length} results.`);
  return results;
}