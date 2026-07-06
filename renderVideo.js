// const { spawn } = require("child_process");
// const path = require("path");
// const fs = require("fs-extra");

// // const rootDir = process.cwd();
// const rootDir = process.cwd();
// const isWin = process.platform === "win32";

// // const ffmpeg = path.join(rootDir, "bin", "ffmpeg.exe");
// const ffmpeg = isWin ? path.join(rootDir, "bin", "ffmpeg.exe") : "ffmpeg";
// const backgroundVideo = path.join(rootDir, "assets", "background.mp4");
// const fontFile = path.join(rootDir, "assets", "font.ttf");

// const outputFolder = path.join(rootDir, "output");
// const tempTextFile = path.join(outputFolder, "temp_shayari.txt");

// function escapeFontPath(file) {
//   return file.replace(/\\/g, "/").replace(":", "\\:");
// }

// function wrapText(text, maxChars = 22) {
//   const words = text.replace(/\r/g, "").replace(/\n/g, " ").split(/\s+/);

//   const lines = [];

//   let current = "";

//   for (const word of words) {
//     if ((current + " " + word).trim().length <= maxChars) {
//       current = (current + " " + word).trim();
//     } else {
//       if (current.length) {
//         lines.push(current);
//       }

//       current = word;
//     }
//   }

//   if (current.length) {
//     lines.push(current);
//   }

//   return lines.join("\n");
// }

// function calculateFontSize(lineCount) {
//   if (lineCount <= 2) return 64;

//   if (lineCount <= 3) return 58;

//   if (lineCount <= 4) return 54;

//   if (lineCount <= 5) return 48;

//   if (lineCount <= 6) return 44;

//   return 40;
// }

// async function renderVideo(shayari) {
//   await fs.ensureDir(outputFolder);

//   const outputVideo = path.join(outputFolder, "reel.mp4");

//   if (await fs.pathExists(outputVideo)) {
//     await fs.remove(outputVideo);
//   }

//   if (process.platform === "win32") {
//     if (!(await fs.pathExists(ffmpeg))) {
//       throw new Error("ffmpeg.exe not found.");
//     }
//   }

//   if (!(await fs.pathExists(backgroundVideo))) throw new Error("background.mp4 not found.");

//   if (!(await fs.pathExists(fontFile))) throw new Error("font.ttf not found.");

//   const wrappedText = wrapText(shayari);

//   await fs.writeFile(tempTextFile, wrappedText, "utf8");

//   const lineCount = wrappedText.split("\n").length;

//   const fontSize = calculateFontSize(lineCount);

//   console.log("");

//   console.log("Wrapped Shayari");

//   console.log("--------------------------------");

//   console.log(wrappedText);

//   console.log("--------------------------------");

//   console.log("Lines :", lineCount);

//   console.log("Font :", fontSize);

//   console.log("");
//   const drawText =
//     "drawtext=" + "fontfile='" + escapeFontPath(fontFile) + "':" + "textfile='" + escapeFontPath(tempTextFile) + "':" + "reload=1:" + "fontcolor=white:" + "fontsize=" + fontSize + ":" + "line_spacing=18:" + "borderw=4:" + "bordercolor=black@0.8:" + "shadowcolor=black@0.7:" + "shadowx=3:" + "shadowy=3:" + "box=1:" + "boxcolor=black@0.25:" + "boxborderw=25:" + "x=(w-text_w)/2:" + "y=(h-text_h)/2";

//   const args = ["-y", "-i", backgroundVideo, "-vf", drawText, "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "copy", outputVideo];

//   console.log("==================================");
//   console.log("Rendering Shayari Video...");
//   console.log("==================================");

//   return new Promise((resolve, reject) => {
//     const ff = spawn(ffmpeg, args);

//     ff.stderr.on("data", (data) => {
//       // Uncomment for FFmpeg Logs
//       // console.log(data.toString());
//     });

//     ff.on("error", reject);

//     ff.on("close", async (code) => {
//       if (await fs.pathExists(tempTextFile)) {
//         await fs.remove(tempTextFile);
//       }

//       if (code === 0) {
//         console.log("");
//         console.log("==================================");
//         console.log("✅ Video Rendered Successfully");
//         console.log("==================================");
//         console.log(outputVideo);
//         console.log("");

//         resolve(outputVideo);
//       } else {
//         reject(new Error("FFmpeg exited with code : " + code));
//       }
//     });
//   });
// }

// module.exports = renderVideo;
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs-extra");

const rootDir = process.cwd();
const isWin = process.platform === "win32";

const ffmpeg = isWin ? path.join(rootDir, "bin", "ffmpeg.exe") : "ffmpeg";
const backgroundVideo = path.join(rootDir, "assets", "background.mp4");
const fontFile = path.join(rootDir, "assets", "font.ttf");
const logoImage = path.join(rootDir, "assets", "logo.png");

const outputFolder = path.join(rootDir, "output");
const tempTextFile = path.join(outputFolder, "temp_shayari.txt");

function escapeFontPath(file) {
  return file.replace(/\\/g, "/").replace(":", "\\:");
}

function wrapText(text, maxChars = 22) {
  const words = text.replace(/\r/g, "").replace(/\n/g, " ").split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim();
    } else {
      if (current.length) lines.push(current);
      current = word;
    }
  }

  if (current.length) lines.push(current);
  return lines.join("\n");
}

function calculateFontSize(lineCount) {
  if (lineCount <= 2) return 64;
  if (lineCount <= 3) return 58;
  if (lineCount <= 4) return 54;
  if (lineCount <= 5) return 48;
  if (lineCount <= 6) return 44;
  return 40;
}

function getRandomHeader() {
  const headers = ["🔥 DIRECT HEART", "💔 FEEL THE PAIN", "🥀 ALONE TRUTH", "✨ SHAYARI STATUS", "💭 DEEP LIFE"];
  return headers[Math.floor(Math.random() * headers.length)];
}

async function renderVideo(shayari) {
  await fs.ensureDir(outputFolder);
  const outputVideo = path.join(outputFolder, "reel.mp4");

  if (await fs.pathExists(outputVideo)) await fs.remove(outputVideo);

  if (process.platform === "win32" && !(await fs.pathExists(ffmpeg))) {
    throw new Error("ffmpeg.exe not found.");
  }

  if (!(await fs.pathExists(backgroundVideo))) throw new Error("background.mp4 not found.");
  if (!(await fs.pathExists(fontFile))) throw new Error("font.ttf not found.");
  if (!(await fs.pathExists(logoImage))) throw new Error("assets/logo.png not found.");

  const wrappedText = wrapText(shayari);
  await fs.writeFile(tempTextFile, wrappedText, "utf8");

  const lineCount = wrappedText.split("\n").length;
  const fontSize = calculateFontSize(lineCount);
  const currentHeader = getRandomHeader();

  // 🎲 1. RANDOM COLOR HASH GENERATION (Meta Bypass)
  // Har baar saturation aur brightness halki si badal jayegi taaki hash code duplicate na aaye
  const randomSaturation = (0.95 + Math.random() * 0.1).toFixed(3); // 0.95 to 1.05
  const randomBrightness = (-0.02 + Math.random() * 0.04).toFixed(3); // -0.02 to 0.02

  // 🎲 2. RANDOM SEEK TIME IN BACKGROUND VIDEO
  // Background video ke random time (0 se lekar 20 second ke beech) se start karega taaki frames naye hon
  const randomStartSecond = Math.floor(Math.random() * 20);

  console.log("\n==================================");
  console.log("🛡️ DYNAMIC HASH BYPASS ENGINE ACTIVE");
  console.log(`Seek Time  : ${randomStartSecond}s | Saturation: ${randomSaturation}`);
  console.log("==================================\n");

  const safeFont = escapeFontPath(fontFile);
  const safeTextFile = escapeFontPath(tempTextFile);

  // Filter mein hum eq filter se random saturation aur brightness laga rahe hain
  const filterComplex = [
    `[0:v]scale=ih*9/16:ih,zoompan=z='zoom+0.0002':d=600:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=60,eq=saturation=${randomSaturation}:brightness=${randomBrightness},noise=alls=2:allf=t,vignette=angle=0.18[bg];`,
    `[1:v]scale=120:-1[logo];`,
    `[bg][logo]overlay=W-w-50:50,`,
    `drawtext=fontfile='${safeFont}':text='${currentHeader}':fontcolor=yellow:fontsize=42:box=1:boxcolor=black@0.85:boxborderw=18:x=(w-text_w)/2:y=240,`,
    `drawtext=fontfile='${safeFont}':textfile='${safeTextFile}':reload=1:fontcolor=white:fontsize=${fontSize}:line_spacing=18:borderw=4:bordercolor=black@0.8:shadowcolor=black@0.7:shadowx=3:shadowy=3:box=1:boxcolor=black@0.35:boxborderw=25:x=(w-text_w)/2:y=(h-text_h)/2`,
  ].join("");

  const args = [
    "-y",
    "-ss",
    String(randomStartSecond), // ⏱️ Video ke bich se random chunk uthayega
    "-i",
    backgroundVideo,
    "-i",
    logoImage,
    "-filter_complex",
    filterComplex,
    "-r",
    "30",
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-t",
    "10",
    "-b:v",
    "2000k",
    "-maxrate",
    "2500k",
    "-bufsize",
    "1228k",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    outputVideo,
  ];

  return new Promise((resolve, reject) => {
    const ff = spawn(ffmpeg, args);

    ff.on("error", reject);
    ff.on("close", async (code) => {
      if (await fs.pathExists(tempTextFile)) await fs.remove(tempTextFile);

      if (code === 0) {
        console.log("\n==================================");
        console.log("✅ 100% Unique Fingerprint Reel Created!");
        console.log("==================================\n");
        resolve(outputVideo);
      } else {
        reject(new Error("FFmpeg exited with code : " + code));
      }
    });
  });
}

module.exports = renderVideo;
