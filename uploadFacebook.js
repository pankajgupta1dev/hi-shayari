const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");
const config = require("./config.json");

async function uploadFacebook(videoPath) {
  try {
    const pageId = String(config.facebook.pageId).trim();
    const accessToken = String(config.facebook.accessToken).trim();

    if (!fs.existsSync(videoPath)) {
      throw new Error("Video file not found.");
    }

    const stats = fs.statSync(videoPath);

    console.log("==================================");
    console.log("Facebook Upload");
    console.log("==================================");
    console.log("Video :", videoPath);
    console.log("Size  :", stats.size, "bytes");
    console.log("==================================");

    if (stats.size < 1024) {
      throw new Error("Video size is less than 1KB.");
    }

    const form = new FormData();

    form.append("access_token", accessToken);

    form.append("source", fs.createReadStream(videoPath), {
      filename: path.basename(videoPath),
      contentType: "video/mp4",
      knownLength: stats.size,
    });

    form.append("description", path.basename(videoPath));

    const res = await axios.post(`https://graph-video.facebook.com/v23.0/${pageId}/videos`, form, {
      headers: {
        ...form.getHeaders(),
        "Content-Length": await new Promise((resolve, reject) => {
          form.getLength((err, length) => {
            if (err) reject(err);
            else resolve(length);
          });
        }),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    console.log("Facebook Upload Success");
    console.log(res.data);

    return res.data;
  } catch (err) {
    console.log("Facebook Upload Failed");

    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log(err.message);
    }

    return null;
  }
}

module.exports = uploadFacebook;
