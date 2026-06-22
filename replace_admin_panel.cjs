const fs = require("fs");

const filePath = "./App.tsx";
console.log(`Reading file: ${filePath}`);

const content = fs.readFileSync(filePath, "utf8");
const lines = content.split("\n");

const startMarker = 'currentView === "NEW_ADMIN_PANEL" ? (';
const endMarker = ') : currentView === "NEW_MANAGER_PANEL" ? (';

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes(startMarker)) {
    startIdx = i;
  }
  if (lines[i].includes(endMarker)) {
    endIdx = i;
    if (startIdx !== -1) break; // Found both
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  console.log(`Found block from ${startIdx + 1} to ${endIdx + 1}`);

  // We want to replace everything BETWEEN startIdx and endIdx
  // Or replace lines inclusive if key is part of it.
  // The markers are the condition check lines.
  // We want to keep the markers but change what's inside?
  // Start line is `... ? (`. We want to Append `<AdminPanel ...` after it?
  // Or Start line is `... ? (`.
  // We can replace the lines strictly BETWEEN.

  // Construct the replacement component call
  const replacement = `        <AdminPanel
          currentUser={currentUser}
          handleLogout={handleLogout}
          setView={setView}
          courses={panelCourses}
          students={panelStudents}
          userOverrides={panelUserOverrides}
          hiddenUsers={panelHiddenUsers}
          companyOverrides={panelCompanyOverrides}
          hiddenCompanies={panelHiddenCompanies}
          onCreateCourse={handleCreateCourse}
          onSaveCourse={handleSaveCourse}
          onDeleteCourse={handleDeleteCourse}
          onPreviewCourse={openAdminTrainingPreview}
          onCreateUser={handleCreatePanelUser}
          onCreateUsersBulk={handleCreatePanelUsersBulk}
          onDeleteUser={handleDeleteUser}
          saveUserOverrides={saveUserOverrides}
          onCreateCompany={saveCompanyOverrides}
          onDeleteCompany={handleDeleteCompany}
          saveCompanyOverrides={saveCompanyOverrides}
        />`;

  const newLines = [
    ...lines.slice(0, startIdx + 1), // Keep the start marker line
    replacement,
    ...lines.slice(endIdx), // Keep the end marker line and everything after
  ];

  fs.writeFileSync(filePath, newLines.join("\n"), "utf8");
  console.log("File updated successfully.");
} else {
  console.log("Markers not found.");
  console.log("Start:", startIdx, "End:", endIdx);
}
