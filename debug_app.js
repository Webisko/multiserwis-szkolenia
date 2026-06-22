const fs = require("fs");
try {
  const filePath = "./App.tsx";
  console.log("CWD:", process.cwd());
  console.log("Exists:", fs.existsSync(filePath));
  const content = fs.readFileSync(filePath, "utf8");
  console.log("Length:", content.length);
} catch (e) {
  console.error("Error:", e.message);
}
