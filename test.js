const ts = require('typescript');

const code = `
function Hello() { 
  return <div>Hi</div>; 
}

const greeting = "Welcome";
`;

const sourceFile = ts.createSourceFile(
  'test.tsx',
  code,
  ts.ScriptTarget.Latest,
  true
);

console.log('Number of statements:', sourceFile.statements.length);
console.log('\nStatement types:');
sourceFile.statements.forEach((statement, index) => {
  console.log(`${index + 1}. ${ts.SyntaxKind[statement.kind]}`);
});