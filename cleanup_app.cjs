const fs = require("fs");

const filePath = "./App.tsx";
console.log(`Reading file: ${filePath}`);

const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log(`Total lines: ${lines.length}`);

// Marker search
let foundStart = -1;
let foundEnd = -1;

// App starts around 124. Search after that.
for (let i = 124; i < lines.length; i++) {
  if (lines[i].trim().startsWith("const getCourseProgram =")) {
    foundStart = i;
    break;
  }
}

for (let i = foundStart; i < lines.length; i++) {
  if (lines[i].trim().startsWith("const CompanyGuardianPanelView =")) {
    foundEnd = i;
    break;
  }
}

if (foundStart !== -1 && foundEnd !== -1) {
  console.log(`Found start marker at ${foundStart + 1}`);
  console.log(`Found end marker at ${foundEnd + 1}`);

  const newLines = [...lines.slice(0, foundStart), ...lines.slice(foundEnd)];

  fs.writeFileSync(filePath, newLines.join("\n"), "utf8");
  console.log("File updated successfully.");
} else {
  console.log(`Could not find markers.`);
}
