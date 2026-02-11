// detectors/duplicatestate.js
import fs from "fs";
import path from "path";
import ts from "typescript";

export async function runDuplicateStateDetector(basePath) {
  const results = [];

  function analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true);

    const stateVars = [];
    ts.forEachChild(sourceFile, function visit(node) {
      if (ts.isCallExpression(node) && node.expression.escapedText === "useState") {
        const parent = node.parent;
        if (ts.isVariableDeclaration(parent)) {
          const name = parent.name.getText(sourceFile);
          stateVars.push(name);
        }
      }
      ts.forEachChild(node, visit);
    });

    if (stateVars.length > 3) {
      results.push({
        file: path.relative(basePath, filePath),
        pattern: "Duplicate State",
        details: `Multiple useState hooks (${stateVars.length}) detected: ${stateVars.join(", ")}`
      });
    }
  }

  function getAllFiles(dir, arr = []) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      fs.statSync(p).isDirectory() ? getAllFiles(p, arr) : /\.(jsx?|tsx?)$/.test(f) && arr.push(p);
    }
    return arr;
  }

  getAllFiles(basePath).forEach(analyzeFile);
  console.log(`✅ Duplicate State Detector found ${results.length} results.`);
  return results;
}