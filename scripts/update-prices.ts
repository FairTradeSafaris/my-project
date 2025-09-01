import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as csv from "csv-parser";
import "dotenv/config"; // Load .env.local

interface PriceRow {
  "NEW Name": string;
  "CURRENT Price (USD)": string;
}

// 👇 Setup Sanity client
const sanity = createClient({
  projectId: "jw971r14", // ✅ your actual project ID
  dataset: "production",
  token:
    "skBbOL9APmEFQ0IAyHvbLKcPxO9HmSzJc5rJz6WyvYP2bldXgKW5NnrvDr1QzkDxvU0JpUFXOYpLGPH74UM7dEusLxMEuP0rP6zbnAxkNTiHAT6QAIAVW8CgORIKuqQxrURgRpWE7ybQjU5tskoKAwmjgGojyEzDlf0rQWaGPF9kmom8IFHc",
  useCdn: false,
  apiVersion: "2023-01-01",
});

const updatePrices = async () => {
  const rows: PriceRow[] = [];

  fs.createReadStream("journeys-prices.csv") // 📄 export as CSV from Excel
    .pipe(csv())
    .on("data", (row) => rows.push(row))
    .on("end", async () => {
      for (const row of rows) {
        const title = row["NEW Name"]?.trim();
        const price = parseFloat(
          row["CURRENT Price (USD)"].replace(/[^0-9.]/g, "")
        );

        if (!title || isNaN(price)) continue;

        const query = `*[_type == "journey" && title == $title][0] {_id}`;
        const journey = await sanity.fetch(query, { title });

        if (journey?._id) {
          await sanity.patch(journey._id).set({ price }).commit();
          console.log(`✅ Updated "${title}" → $${price}`);
        } else {
          console.log(`❌ Not found: "${title}"`);
        }
      }

      console.log("\n🎉 All done!");
    });
};

updatePrices();
