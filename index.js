const fs = require("fs-extra");
const path = require("path");

const renderVideo = require("./renderVideo");
const uploadFacebook = require("./uploadFacebook");
const deleteShayari = require("./deleteShayari");

const shayariFile = path.join(__dirname, "shayari.json");

async function start() {
  try {
    if (!(await fs.pathExists(shayariFile))) {
      throw new Error("shayari.json not found.");
    }

    const shayariList = await fs.readJson(shayariFile);

    if (!Array.isArray(shayariList) || shayariList.length === 0) {
      console.log("❌ No Shayari Found.");
      return;
    }

    const currentShayari = shayariList[0];

    console.log("==================================");
    console.log("Selected Shayari");
    console.log("==================================");
    console.log(currentShayari.text);
    console.log("==================================");

    // Render Video
    const output = await renderVideo(currentShayari.text);

    console.log("");
    console.log("✅ Video Created Successfully");
    console.log(output);

    // Upload to Facebook
    const fbResult = await uploadFacebook(output);

    if (!fbResult) {
      console.log("");
      console.log("❌ Facebook Upload Failed");
      console.log("⚠️ Shayari will NOT be deleted.");
      return;
    }

    console.log("");
    console.log("✅ Facebook Upload Completed");

    // Delete Shayari from JSON
    await deleteShayari();

    // Delete Generated Video
    if (await fs.pathExists(output)) {
      await fs.remove(output);
      console.log("🗑️ Output video deleted.");
    }

    console.log("");
    console.log("🎉 Pipeline Completed Successfully.");
  } catch (err) {
    console.error("");
    console.error("❌ Pipeline Failed");
    console.error(err);
  }
}

start();
