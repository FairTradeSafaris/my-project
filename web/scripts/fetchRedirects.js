const { client } = require("./sanity-client.cjs");
const fs = require("fs");
const path = require("path");

// Normalize URL (critical for dedupe + consistency)
function normalize(url) {
  if (!url) return "";
  return url.toLowerCase().replace(/\/+$/, ""); // remove trailing slash
}

function isJunkUrl(url) {
  if (!url) return true;

  const u = url.toLowerCase();

  return (
    u.includes("/tag/") ||
    u.match(/^\/\d{4}\//) || // date archives
    u.includes("/page/") ||
    u.includes("&sa=") ||
    u.includes("/feed") ||
    u.includes("/null") ||
    u.includes("/category/") ||
    u.includes("/author/") ||
    u.includes("?p=") // WordPress query URLs
  );
}

async function fetchRedirects() {
  const redirects = await client.fetch(
    `*[_type == "redirect"]{ source, destination, permanent }`,
  );

  const cleaned = [];
  const gone = [];
  const seen = new Set();

  for (const r of redirects) {
    let source = normalize(r.source);

    if (!source) {
      console.log("❌ DROPPED (no source):", r);
      continue;
    }

    if (isJunkUrl(source)) {
      console.log("🚫 GONE:", source);
      gone.push(source);
      continue;
    }

    if (seen.has(source)) {
      console.log("⚠️ DUPLICATE:", source);
      continue;
    }

    seen.add(source);

    console.log("✅ REDIRECT:", source);

    cleaned.push({
      source,
      destination: r.destination,
      permanent: r.permanent ?? true,
    });
  }

  // Deduplicate gone URLs
  const uniqueGone = [...new Set(gone)];

  // Write redirects.json
  const redirectsPath = path.join(__dirname, "..", "public", "redirects.json");
  fs.writeFileSync(redirectsPath, JSON.stringify(cleaned, null, 2));

  // Write gone-urls.ts
  const gonePath = path.join(__dirname, "..", "lib", "gone-urls.ts");

  const goneFileContent = `export const goneUrls = ${JSON.stringify(
    uniqueGone,
    null,
    2,
  )};\n`;

  fs.writeFileSync(gonePath, goneFileContent);

  console.log(`\n✅ Final redirects: ${cleaned.length}`);
  console.log(`🚫 Final gone URLs: ${uniqueGone.length}`);
}

fetchRedirects().catch((err) => {
  console.error("❌ Failed to fetch redirects:", err);
});
