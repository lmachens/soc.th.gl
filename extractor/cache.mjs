import klaw from "klaw";
import fs from "node:fs/promises";
import { readYAMLFile } from "./lib/files.mjs";

console.log("Searching GUIDs...");
const cache = {};

for await (const file of klaw("./SongsOfConquest/ExportedProject/Assets")) {
  if (
    file.path.endsWith("asset.meta") ||
    file.path.endsWith("webp.meta") ||
    file.path.endsWith("prefab.meta")
  ) {
    const meta = await readYAMLFile(file.path);
    if (!meta.guid) {
      continue;
    }
    cache[meta.guid] = file.path;
  }
}
await fs.writeFile("./out/cache.json", JSON.stringify(cache));
