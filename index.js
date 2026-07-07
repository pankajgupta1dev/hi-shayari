const fs = require("fs-extra");
const path = require("path");

const renderVideo = require("./renderVideo");
const uploadFacebook = require("./uploadFacebook");
const deleteShayari = require("./deleteShayari");

const shayariFile = path.join(__dirname, "shayari.json");

// ⏳ Function jo check karegi ki file completely write ho chuki hai ya nahi
async function waitForFileStabilize(filePath, maxAttempts = 10) {
  console.log("⏳ Waiting for file disk flush to fully complete...");
  let lastSize = -1;

  for (let i = 0; i < maxAttempts; i++) {
    if (fs.existsSync(filePath)) {
      const currentSize = fs.statSync(filePath).size;
      // Agar size badhna ruk gaya hai aur file 1KB se badi hai, matlab write complete ho gaya
      if (currentSize === lastSize && currentSize > 1024) {
        console.log(`🔒 File stabilized successfully! Size: ${(currentSize / (1024 * 1024)).toFixed(2)} MB`);
        return true;
      }
      lastSize = currentSize;
    }
    await new Promise((r) => setTimeout(r, 1500)); // 1.5 second ka wait har check ke beech
  }
  return false;
}

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

    // 🎬 Render Video
    const output = await renderVideo(currentShayari.text);

    console.log("");
    console.log("✅ Video Created Successfully");
    console.log(output);

    // 🛡️ CRITICAL LOCK: Jab tak file pure size ke sath disk par block na ho jaye, aage mat badho
    const isReady = await waitForFileStabilize(output);
    if (!isReady) {
      throw new Error("FFmpeg output file is corrupt, incomplete or zero bytes.");
    }

    // 🚀 Upload to Facebook (Ab Yeh Kabhi Fail Nahi Hoga!)
    // const fbResult = await uploadFacebook(output);

    // if (!fbResult) {
    //   console.log("");
    //   console.log("❌ Facebook Upload Failed");
    //   console.log("⚠️ Shayari will NOT be deleted.");
    //   return;
    // }

    // console.log("");
    // console.log("✅ Facebook Upload Completed");

    // // 🗑️ Delete Shayari from JSON
    // await deleteShayari();

    // // 🗑️ Delete Generated Video
    // if (await fs.pathExists(output)) {
    //   await fs.remove(output);
    //   console.log("🗑️ Output video deleted from local storage.");
    // }

    console.log("");
    console.log("🎉 Pipeline Completed Successfully.");
  } catch (err) {
    console.error("");
    console.error("❌ Pipeline Failed");
    console.error(err);
  }
}

start();
