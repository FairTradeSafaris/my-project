/* eslint-disable @typescript-eslint/no-require-imports */

const globby = require("globby");
const fs = require("fs");
const path = require("path");

(async () => {
  const files = await globby(["app/**/page.tsx"]);

  const routes = files.map((file) => {
    const route = file
      .replace("app", "")
      .replace("/page.tsx", "")
      .replace(/\[([^\]]+)\]/g, ":$1"); // convert [slug] → :slug

    return route === "" ? "/" : route;
  });

  const outputPath = path.join(process.cwd(), "public/routes.json");
  fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
  console.log("✅ App routes generated:", routes);
})();
