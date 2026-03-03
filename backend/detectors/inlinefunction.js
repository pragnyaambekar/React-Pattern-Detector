import fs from "fs";
import path from "path";
import ts from "typescript";

export async function runInlineFunctionDetector(basePath) {
  const results = [];

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

      const inlineFunctions = [];

      function visit(node) {
        // Look for JSX attributes with inline arrow functions or function expressions
        if (ts.isJsxAttribute(node) && node.initializer) {
          if (ts.isJsxExpression(node.initializer)) {
            const expr = node.initializer.expression;
            
            // Check for arrow functions or function expressions
            if (expr && (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr))) {
              const attrName = ts.isIdentifier(node.name) ? node.name.text : "unknown";
              const lineNumber = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
              
              inlineFunctions.push({
                attribute: attrName,
                line: lineNumber,
              });
            }
          }
        }

        ts.forEachChild(node, visit);
      }

      visit(sourceFile);

      // Group by component/file and count occurrences
      if (inlineFunctions.length > 0) {
        const count = inlineFunctions.length;
        let severity = "Moderate";
        if (count >= 10) severity = "Severe";
        if (count >= 20) severity = "Extreme";

        const examples = inlineFunctions.slice(0, 3).map(f => `${f.attribute} (line ${f.line})`).join(", ");
        const moreText = inlineFunctions.length > 3 ? `, +${inlineFunctions.length - 3} more` : "";

        results.push({
          file: path.relative(basePath, filePath),
          pattern: "Inline Function",
          details: `${count} inline function(s) in JSX: ${examples}${moreText}`,
          severity,
        });
      }
    } catch (err) {
      console.error(`❌ Error analyzing ${filePath}:`, err.message);
    }
  }

  const files = getAllFiles(basePath);
  files.forEach((file) => analyzeFile(file));

  console.log(`✅ Inline Function Detector found ${results.length} files with issues.`);

  return results.length
    ? results
    : [
        {
          file: "N/A",
          pattern: "Inline Function",
          details: "No inline functions found in JSX.",
          severity: "None",
        },
      ];
}
