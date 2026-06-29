const fs = require("fs-extra");
const path = require("path");

const shayariFile = path.join(__dirname, "shayari.json");

async function deleteShayari() {
  if (!(await fs.pathExists(shayariFile))) {
    throw new Error("shayari.json not found.");
  }

  const shayariList = await fs.readJson(shayariFile);

  if (!Array.isArray(shayariList)) {
    throw new Error("Invalid shayari.json format.");
  }

  if (shayariList.length === 0) {
    console.log("⚠️ No Shayari Left.");
    return;
  }

  const deletedShayari = shayariList.shift();

  await fs.writeJson(shayariFile, shayariList, {
    spaces: 2,
  });

  console.log("");
  console.log("================================");
  console.log("🗑️ Shayari Removed Successfully");
  console.log("================================");
  console.log("ID :", deletedShayari.id);
  console.log(deletedShayari.text);
  console.log("================================");
  console.log(`Remaining Shayari : ${shayariList.length}`);
  console.log("");

  return deletedShayari;
}

module.exports = deleteShayari;
