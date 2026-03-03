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

// Check if a node is a React component
function isReactComponent(node, sourceFile) {
  const text = node.getText(sourceFile);
  
  // Must return JSX or have JSX elements
  const hasJSX = /<[A-Z]/.test(text) || /<[a-z]+[\s>]/.test(text);
  if (!hasJSX) return false;
  
  // Check for React hooks (strong indicator)
  if (/use(State|Effect|Context|Reducer|Callback|Memo|Ref|ImperativeHandle|LayoutEffect|DebugValue)/.test(text)) {
    return true;
  }
  
  // Check for JSX return statement
  if (/return\s*\(?\s*</.test(text)) {
    return true;
  }
  
  // Function name starts with capital letter (React convention)
  let name = null;
  if (ts.isFunctionDeclaration(node) && node.name) {
    name = node.name.text;
  } else if (ts.isVariableStatement(node)) {
    const decl = node.declarationList.declarations[0];
    if (decl && ts.isIdentifier(decl.name)) {
      name = decl.name.text;
    }
  }
  
  return name && /^[A-Z]/.test(name);
}

// Count JSX elements using AST
function countJSXElements(node) {
  let count = 0;
  
  function visit(n) {
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
      count++;
    }
    ts.forEachChild(n, visit);
  }
  
  visit(node);
  return count;
}

// Count unique React hooks using AST
function countHooks(node, sourceFile) {
  const hooks = new Set();
  
  function visit(n) {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression)) {
      const name = n.expression.text;
      if (/^use[A-Z]/.test(name)) {
        hooks.add(name);
      }
    }
    ts.forEachChild(n, visit);
  }
  
  visit(node);
  return hooks.size;
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
        let componentNode = null;
        let componentName = "Anonymous";

        // Check function declarations
        if (ts.isFunctionDeclaration(node)) {
          componentNode = node;
          if (node.name) componentName = node.name.text;
        }
        // Check arrow functions and function expressions in variable declarations
        else if (ts.isVariableStatement(node)) {
          const decl = node.declarationList.declarations[0];
          if (decl && decl.initializer && 
              (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer))) {
            componentNode = decl.initializer;
            if (ts.isIdentifier(decl.name)) {
              componentName = decl.name.text;
            }
          }
        }

        if (componentNode && isReactComponent(componentNode, sourceFile)) {
          const loc = countLines(componentNode, sourceFile);
          const jsxCount = countJSXElements(componentNode);
          const hookCount = countHooks(componentNode, sourceFile);

          // ✅ All 3 conditions must hold
          if (loc > MAX_LOC && jsxCount > MAX_JSX && hookCount > MAX_HOOKS) {
            let severity = "Moderate";
            if (loc > 300 || jsxCount > 20 || hookCount > 6) severity = "Severe";
            if (loc > 400 || jsxCount > 25 || hookCount > 8) severity = "Extreme";

            results.push({
              file: path.relative(basePath, filePath),
              pattern: "God Component",
              details: `${componentName}: LOC=${loc}, JSX=${jsxCount}, Hooks=${hookCount}`,
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
