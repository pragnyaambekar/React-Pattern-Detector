import fs from "fs";
import path from "path";
import ts from "typescript";

// System props to ignore
const SYSTEM_PROPS = new Set([
  "className", "style", "key", "ref", "id", "children",
  "onClick", "onChange", "onSubmit", "onBlur", "onFocus",
  "type", "value", "placeholder", "disabled", "required",
  "href", "src", "alt", "title", "role", "aria-label"
]);

export async function runPropDrillingDetector(basePath) {
  const results = [];

  // --- Recursively collect source files ---
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

  // --- Count lines in a TypeScript node ---
  function countLines(node, sourceFile) {
    const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
    return end.line - start.line + 1;
  }

  // --- Extract props from function parameters ---
  function extractPropsFromParams(node) {
    const props = new Set();
    
    if (!node.parameters || node.parameters.length === 0) return props;
    
    const firstParam = node.parameters[0];
    
    // Handle destructured props: function Component({ prop1, prop2 })
    if (firstParam.name && ts.isObjectBindingPattern(firstParam.name)) {
      firstParam.name.elements.forEach(element => {
        if (ts.isBindingElement(element) && ts.isIdentifier(element.name)) {
          props.add(element.name.text);
        }
      });
    }
    // Handle props object: function Component(props)
    else if (firstParam.name && ts.isIdentifier(firstParam.name)) {
      // We'll track props.x usage in the component
      return new Set(["props"]);
    }
    
    return props;
  }

  // --- Find JSX attributes being passed down ---
  function findPassedProps(node, receivedProps) {
    const passedProps = {};
    
    function visit(n) {
      // Look for JSX elements with attributes
      if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
        const attributes = ts.isJsxElement(n) 
          ? n.openingElement.attributes 
          : n.attributes;
        
        if (ts.isJsxAttributes(attributes)) {
          attributes.properties.forEach(prop => {
            if (ts.isJsxAttribute(prop) && ts.isIdentifier(prop.name)) {
              const attrName = prop.name.text;
              
              // Skip system props
              if (SYSTEM_PROPS.has(attrName)) return;
              
              // Check if the value references a received prop
              if (prop.initializer && ts.isJsxExpression(prop.initializer)) {
                const expr = prop.initializer.expression;
                
                // Direct prop pass: <Child prop={prop} />
                if (expr && ts.isIdentifier(expr)) {
                  const valueName = expr.text;
                  if (receivedProps.has(valueName)) {
                    passedProps[valueName] = (passedProps[valueName] || 0) + 1;
                  }
                }
                // Props object access: <Child prop={props.prop} />
                else if (expr && ts.isPropertyAccessExpression(expr)) {
                  if (ts.isIdentifier(expr.expression) && expr.expression.text === "props") {
                    if (ts.isIdentifier(expr.name)) {
                      const propName = expr.name.text;
                      passedProps[propName] = (passedProps[propName] || 0) + 1;
                    }
                  }
                }
              }
            }
          });
        }
      }
      
      ts.forEachChild(n, visit);
    }
    
    visit(node);
    return passedProps;
  }

  // --- Check if node is a React component ---
  function isReactComponent(node, sourceFile) {
    const text = node.getText(sourceFile);
    const hasJSX = /<[A-Z]/.test(text) || /<[a-z]+[\s>]/.test(text);
    return hasJSX;
  }

  // --- Analyze each file for prop drilling ---
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

      const totalLOC = code.split("\n").length;

      function visit(node) {
        let componentNode = null;
        let componentName = "Anonymous";

        // Check function declarations
        if (ts.isFunctionDeclaration(node)) {
          componentNode = node;
          if (node.name) componentName = node.name.text;
        }
        // Check arrow functions in variable declarations
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
          const receivedProps = extractPropsFromParams(componentNode);
          const passedProps = findPassedProps(componentNode, receivedProps);
          
          // Flag props that are passed down multiple times
          for (const [prop, count] of Object.entries(passedProps)) {
            if (count >= 3) {
              let severity = "Moderate";
              if (count >= 5) severity = "Severe";
              if (count >= 7) severity = "Extreme";

              results.push({
                file: path.relative(basePath, filePath),
                pattern: "Prop Drilling",
                details: `${componentName}: prop '${prop}' passed ${count}× through component tree`,
                severity,
              });
            }
          }
        }

        ts.forEachChild(node, visit);
      }

      visit(sourceFile);
    } catch (err) {
      console.error(`❌ Error analyzing ${filePath}:`, err.message);
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
