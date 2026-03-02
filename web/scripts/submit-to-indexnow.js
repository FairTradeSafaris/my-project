// scripts/submit-to-indexnow.js

const https = require("https");
const fs = require("fs");
const path = require("path");

const INDEXNOW_KEY = "43a0b1d934";
const DOMAIN = "https://www.fairtradesafaris.com";
const KEY_FILE_PATH = path.join(__dirname, `../public/${INDEXNOW_KEY}.txt`);

// Step 1: Ensure key file exists in /public
function verifyKeyFile() {
  try {
    if (!fs.existsSync(KEY_FILE_PATH)) {
      fs.writeFileSync(KEY_FILE_PATH, INDEXNOW_KEY);
      console.log(`✅ Key file created at: public/${INDEXNOW_KEY}.txt`);
    } else {
      console.log(`✅ Key file already exists.`);
    }
  } catch (err) {
    console.warn("⚠️ Key file verification failed (continuing):", err.message);
  }
}

// Step 2: Submit a URL to IndexNow safely
function submitToIndexNow(url) {
  return new Promise((resolve) => {
    try {
      const fullUrl = `${DOMAIN}${url}`;
      const indexNowUrl = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(
        fullUrl,
      )}&key=${INDEXNOW_KEY}`;

      const req = https.get(indexNowUrl, (res) => {
        console.log(`📬 Submitted to IndexNow: ${fullUrl}`);
        console.log(`🔁 Status: ${res.statusCode}`);

        // Consume response to avoid ECONNRESET
        res.on("data", () => {});
        res.on("end", () => resolve());
      });

      req.on("error", (err) => {
        console.warn(
          "⚠️ IndexNow submission error (ignored for build):",
          err.message,
        );
        resolve(); // Always resolve — never fail build
      });

      req.setTimeout(8000, () => {
        console.warn("⚠️ IndexNow request timed out (ignored)");
        req.destroy();
        resolve();
      });
    } catch (err) {
      console.warn(
        "⚠️ IndexNow unexpected error (ignored for build):",
        err.message,
      );
      resolve();
    }
  });
}

// Run safely
(async () => {
  try {
    verifyKeyFile();
    await submitToIndexNow("/sitemap.xml");
    console.log("✅ IndexNow script finished safely.");
  } catch (err) {
    console.warn("⚠️ IndexNow script failed but build continues:", err.message);
  } finally {
    process.exit(0); // ALWAYS exit success
  }
})();
