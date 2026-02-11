import fs from "fs";
import path from "path";
import ts from "typescript";

export async function runPropDrillingDetector(basePath) {
  const results = [];

  // --- Recursively collect source files ---
  function getAllFiles(dirPath, arr = []) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) getAllFiles(fullPath, arr);
      else if (/\.(jsx?|tsx?)$/.test(file)) arr.push(fullPath);
    }
    return arr;
  }

  // --- Count lines in a TypeScript node ---
  function countLines(node, sourceFile) {
    const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
    return end.line - start.line + 1;
  }

  // --- Analyze each file for prop drilling ---
  function analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      code,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    );

    // --- Metrics ---
    const totalLOC = code.split("\n").length;
    const jsxCount = (code.match(/<\w+/g) || []).length;
    const hookCount = (code.match(/use(State|Effect|Memo|Callback|Ref)/g) || []).length;

    // --- Prop drilling detection ---
    // Match propName=... but ignore built-in attributes
    const propMatches = [...code.matchAll(/\b(\w+)\s*=\s*{?[^}]*}?/g)];
    const propCounts = {};

    for (const match of propMatches) {
      const prop = match[1];
      if (!prop) continue;

      // Ignore React system props
      if (["className", "style", "key", "ref", "id", "onClick", "children"].includes(prop))
        continue;

      propCounts[prop] = (propCounts[prop] || 0) + 1;
    }

    // --- Flag props passed multiple times (deep drilling) ---
    for (const [prop, count] of Object.entries(propCounts)) {
      if (count >= 3) {
        let severity = "Moderate";
        if (count >= 5) severity = "Severe";
        if (count > 7) severity = "Extreme";

        results.push({
          file: path.relative(basePath, filePath),
          pattern: "Prop Drilling",
          details: `${prop} passed ${count}× | LOC=${totalLOC}, JSX=${jsxCount}, Hooks=${hookCount}`,
          severity,
        });
      }
    }
  }

  // --- Run on all files ---
  const files = getAllFiles(basePath);
  for (const file of files) analyzeFile(file);

  console.log(`✅ Prop Drilling Detector found ${results.length} issues.`);

  // --- Always return array (avoid frontend crash) ---
  return results.length
    ? results
    : [
        {
          file: "N/A",
          pattern: "Prop Drilling",
          details: "No prop drilling issues found.",
          severity: "None",
        },
      ];
}
