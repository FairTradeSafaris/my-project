const { client } = require("./sanity-client.cjs");
const fs = require("fs");
const path = require("path");

async function fetchRedirects() {
  const redirects = await client.fetch(
    `*[_type == "redirect"]{ source, destination, permanent }`
  );
  const outputPath = path.join(__dirname, "..", "public", "redirects.json");
  fs.writeFileSync(outputPath, JSON.stringify(redirects, null, 2));
  console.log("✅ Redirects saved to:", outputPath);
}

fetchRedirects().catch((err) => {
  console.error("❌ Failed to fetch redirects:", err);
});
