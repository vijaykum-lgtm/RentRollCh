import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildDemoDataset } from "./data";

const seedDir = fileURLToPath(new URL(".", import.meta.url));
const runDate = new Date();
const dataset = buildDemoDataset(runDate);

const outDir = join(seedDir, "output");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "demo-dataset.json");
writeFileSync(outFile, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");

const occupied = dataset.units.filter((u) => u.occupied).length;
const vacant = dataset.units.length - occupied;
const currentTenants = dataset.tenants.filter((t) => t.isCurrent).length;
const pastTenants = dataset.tenants.length - currentTenants;

console.log(`Generated demo dataset for run date ${dataset.runDate}`);
console.log(`  properties: ${dataset.properties.length}`);
console.log(`  units: ${dataset.units.length} (${occupied} occupied, ${vacant} vacant)`);
console.log(`  tenants: ${dataset.tenants.length} (${currentTenants} current, ${pastTenants} past)`);
console.log(`  rent entries: ${dataset.rentEntries.length}`);
console.log(`  reminders: ${dataset.reminders.length}`);
console.log(`  requests: ${dataset.requests.length}`);
console.log(`  documents: ${dataset.documents.length}`);
console.log(`Wrote ${outFile}`);
console.log("");
console.log(
  "NOTE: this only writes a JSON snapshot. writeToSupabase() (write-to-supabase.ts) is not implemented — no database schema exists yet. See SPEC.md § Schema dependency.",
);
