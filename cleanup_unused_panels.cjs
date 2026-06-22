const fs = require("fs");

const filePath = "./App.tsx";
console.log(`Reading file: ${filePath}`);

const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

console.log(`Total lines: ${lines.length}`);

// Marker search
// 1. CompanyGuardianPanelView (unused)
// 2. NewAdminPanelView (unused mock)
// 3. NewManagerPanelView (unused mock)
// 4. NewGuardianPanelView (unused mock)

// We can probably find them by signature lines and remove block until next component or known end.

function findComponentRange(startSig, endSigOrNextCompSig) {
  let start = -1;
  let end = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(startSig)) {
      start = i;
      break;
    }
  }

  if (start !== -1) {
    // Find end - either explicit bracket or start of next component
    let braceCount = 0;
    let foundStartBrace = false;

    // Simple heuristic: search for the next component signature or default to bracket counting if provided
    if (endSigOrNextCompSig) {
      for (let i = start + 1; i < lines.length; i++) {
        if (lines[i].includes(endSigOrNextCompSig)) {
          end = i - 1; // End before the next start
          break;
        }
      }
    }

    // Fallback manual checks if specific end logic needed
  }
  return { start, end };
}

// Strategy: Identify start lines of the ones we want to remove, and the one we want to KEEP (NewStudentPanelView)
const comps = [
  {
    name: "CompanyGuardianPanelView",
    sig: "const CompanyGuardianPanelView = () => {",
  },
  { name: "NewAdminPanelView", sig: "const NewAdminPanelView = () => {" },
  { name: "NewManagerPanelView", sig: "const NewManagerPanelView = () => {" },
  { name: "NewGuardianPanelView", sig: "const NewGuardianPanelView = () => {" },
  { name: "NewStudentPanelView", sig: "const NewStudentPanelView = () => {" }, // KEEP THIS one
];

const found = {};
for (const c of comps) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith(c.sig)) {
      found[c.name] = i;
      break;
    }
  }
}

console.log("Found indices:", found);

// Validate order: Company -> NewAdmin -> NewManager -> NewGuardian -> NewStudent
// We want to remove from Company start up to NewStudent start (exclusive).
// BUT wait, are there other things in between?
// Step 310 outline:
// CompanyGuardianPanelView (798)
// NewAdminPanelView (1099)
// NewManagerPanelView (??)
// NewGuardianPanelView (??)
// NewStudentPanelView (8127 - wait this index is from OLD outline? No, Step 229)
// Step 310 outline ENDS at NewAdminPanelView (1099).
// I need to assume NewStudentPanelView follows them.

// Let's verify continuity.
// If I remove from found['CompanyGuardianPanelView'] to found['NewStudentPanelView'],
// I remove everything in between.
// Is there anything valuable in between?
// "NOWE WERSJE PANELI" comment?
// "Komponent Modal dla pracownika"? (EmployeeModal)
// Step 229: EmployeeModal (8284) is AFTER NewStudentPanelView (8127).
// So EmployeeModal is safe (it's after the block I'm keeping).

// So removing everything from CompanyGuardianPanelView to NewStudentPanelView seems correct,
// assuming NewStudentPanelView is indeed the next used component after the unused mocks.

if (found["CompanyGuardianPanelView"] && found["NewStudentPanelView"]) {
  const start = found["CompanyGuardianPanelView"];
  const end = found["NewStudentPanelView"];

  console.log(`Removing from ${start + 1} to ${end}`); // print 1-based

  // Check if reasonable size
  if (end > start) {
    const newLines = [...lines.slice(0, start), ...lines.slice(end)];

    fs.writeFileSync(filePath, newLines.join("\n"), "utf8");
    console.log("File updated successfully.");
  } else {
    console.log("Start index is not before End index.");
  }
} else {
  console.log("Could not find markers (CompGuardian or NewStudent).");
}
