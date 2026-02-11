import fs from "fs";
import path from "path";
import ts from "typescript";

// --- Thresholds ---
const MAX_LOC = 200;
const MAX_JSX = 12;
const MAX_HOOKS = 4;

// Count lines of code
function countLines(node, sourceFile) {
  const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
  return end.line - start.line + 1;
}

export async function runGodDetector(basePath) {
  const results = [];

  function analyzeFile(filePath) {
    try {
      const code = fs.readFileSync(filePath, "utf8");
      const sourceFile = ts.createSourceFile(
        filePath,
        code,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX
      );

      function visit(node) {
        const isFunction =
          ts.isFunctionDeclaration(node) ||
          (ts.isVariableStatement(node) &&
            node.declarationList.declarations.some((d) => {
              const init = d.initializer;
              return init && ts.isArrowFunction(init);
            }));

        if (isFunction) {
          const codeText = node.getText(sourceFile);
          const loc = countLines(node, sourceFile);
          const jsxCount = (codeText.match(/<\w+/g) || []).length;
          const hookMatches = codeText.match(/use[A-Z]\w*/g) || [];
          const uniqueHooks = [...new Set(hookMatches)];
          const hookCount = uniqueHooks.length;

          // ✅ All 3 conditions must hold
          if (loc > MAX_LOC && jsxCount > MAX_JSX && hookCount > MAX_HOOKS) {
            let severity = "Moderate";
            if (loc > 300 || jsxCount > 20 || hookCount > 6) severity = "Severe";
            if (loc > 400 || jsxCount > 25 || hookCount > 8) severity = "Extreme";

            results.push({
              file: path.relative(basePath, filePath),
              pattern: "God Component",
              details: `LOC=${loc}, JSX=${jsxCount}, Hooks=${hookCount}`,
              severity,
            });
          }
        }

        ts.forEachChild(node, visit);
      }

      visit(sourceFile);
    } catch (err) {
      console.error(`❌ Error analyzing ${filePath}:`, err.message);
    }
  }

  // Recursively collect files
  function getAllFiles(dirPath, arr = []) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory() && !file.includes("node_modules")) {
        getAllFiles(fullPath, arr);
      } else if (/\.(jsx?|tsx?)$/.test(file)) {
        arr.push(fullPath);
      }
    }
    return arr;
  }

  console.log(`📁 Scanning for God Components in: ${basePath}`);
  const files = getAllFiles(basePath);

  for (const file of files) {
    analyzeFile(file);
  }

  console.log(`✅ God Detector found ${results.length} components.`);

  // Return fallback message if no results
  if (results.length === 0) {
    return [
      {
        file: "N/A",
        pattern: "No God Components Detected",
        details: "All components are within reasonable complexity limits.",
        severity: "None",
      },
    ];
  }

  return results;
}
