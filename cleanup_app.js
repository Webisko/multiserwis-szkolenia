const fs = require("fs");

const filePath =
  "d:/Webisko/_KLIENCI/Kamil Kapruziak/multiserwis-kutno/App.tsx";
console.log(`Reading file: ${filePath}`);

const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log(`Total lines: ${lines.length}`);

// Need to match these lines exactly as they appear in the file
// Note: Indentation must match.
// Based on previous views, indentation is 2 spaces for these consts?
// Or maybe it's inside App component, so it has 2 spaces indentation.

const startMarker = "  const getCourseProgram = (courseId: string) => {";
const endMarker = "  const CompanyGuardianPanelView = () => {";

let foundStart = -1;
let foundEnd = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("const getCourseProgram = (courseId: string)")) {
    foundStart = i;
    console.log(`Found start candidates at ${i + 1}: ${line}`);
    // We take the first one? getCourseProgram is likely unique.
    if (foundStart !== -1) break;
  }
}

// Reset foundStart search logic: find the FIRST occurrence inside App component?
// App starts around 124.
// So search after 124.

foundStart = -1;
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

  // Remove lines from foundStart up to foundEnd - 1
  const newLines = [...lines.slice(0, foundStart), ...lines.slice(foundEnd)];

  fs.writeFileSync(filePath, newLines.join("\n"), "utf8");
  console.log("File updated successfully.");
} else {
  console.log(`Could not find markers.`);
  console.log(`Start found: ${foundStart}`);
  console.log(`End found: ${foundEnd}`);
}
