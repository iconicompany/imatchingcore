import { SQL } from "bun";
import { readFileSync } from "fs";
import * as path from "path";

const sql = new SQL(process.env.DATABASE_URL || "postgres://localhost/imatchingtesting");

async function main() {
  console.log("Starting import...");

  // 1. Process categories.csv (level = 0)
  const categoriesCsv = readFileSync(path.join(__dirname, "../data/categories.csv"), "utf-8");
  const categories = categoriesCsv.split("\n").slice(1).map(line => line.replace(/"/g, '').trim()).filter(Boolean);

  for (const catName of categories) {
    await sql`
      INSERT INTO specializations (name, level)
      VALUES (${catName}, 0)
      ON CONFLICT (lower(name)) DO UPDATE SET level = EXCLUDED.level
    `;
  }
  console.log(`Processed ${categories.length} categories.`);

  // 2. Process specializations.csv (level = 1)
  const specsCsv = readFileSync(path.join(__dirname, "../data/specializations.csv"), "utf-8");
  const specs = specsCsv.split("\n").slice(1).map(line => {
    const firstPart = line.split(";")[0];
    return firstPart ? firstPart.replace(/"/g, '').trim() : '';
  }).filter(Boolean);

  for (const specName of specs) {
    await sql`
      INSERT INTO specializations (name, level)
      VALUES (${specName}, 1)
      ON CONFLICT (lower(name)) DO UPDATE SET level = 1 WHERE specializations.level != 0
    `;
  }
  console.log(`Processed ${specs.length} specializations.`);

  // 3. Process specializations.csv to link via parent_id
  const mappingsCsv = readFileSync(path.join(__dirname, "../data/specializations.csv"), "utf-8");
  const mappings = mappingsCsv.split("\n").slice(1).map(line => line.trim()).filter(Boolean);

  let linkedCount = 0;
  for (const line of mappings) {
    const [specName, catName] = line.split(";").map(s => s.trim());
    if (!specName || !catName) continue;

    // find category id
    const resCat = await sql`SELECT id FROM specializations WHERE lower(name) = lower(${catName}) AND level = 0 LIMIT 1`;
    if (resCat.length === 0) {
      console.warn(`Category not found: ${catName}`);
      continue;
    }
    const catId = resCat[0].id;

    // update specialization with parent_id
    await sql`
      UPDATE specializations 
      SET parent_id = ${catId}
      WHERE lower(name) = lower(${specName}) AND level = 1
    `;
    linkedCount++;
  }
  console.log(`Linked ${linkedCount} specializations to categories.`);
  console.log("Import complete.");

  await sql.close();
}

main().catch(console.error);
