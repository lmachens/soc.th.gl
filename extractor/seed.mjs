import { readYAMLFile } from "./lib/files.mjs";
import { buildAssetByManifest, findManifests } from "./lib/assets.mjs";
import { writeJSONFile } from "./lib/out.mjs";

const terms = await readYAMLFile(
  "./SongsOfConquest/ExportedProject/Assets/Resources/I2Languages.asset"
);

const locales = terms.mSource.mLanguages.map((item, index) => ({
  ...item,
  index,
}));
const termMap = terms.mSource.mTerms.reduce((curr, term) => {
  return {
    ...curr,
    [term.term]: locales
      .filter((locale) => locale.code)
      .reduce(
        (curr, locale) => ({
          ...curr,
          [locale.code.toString()]: term.languages[locale.index],
        }),
        {}
      ),
  };
}, {});

console.log(`Writing TermMap`);
await writeJSONFile(termMap, "TermMap");

const manifests = await findManifests();
const promises = manifests.map(async (manifest) => {
  const filename = manifest.split(/[\\/]/).at(-1);
  const name = filename.replace("Manifest.asset", "").trim();
  console.log(`Processing ${name}`);
  const assets = await buildAssetByManifest(manifest);
  if (assets) {
    await writeJSONFile(assets, name);
    console.log(`Replaced ${assets.length} docs`);
  } else {
    console.log(`Nothing to do here`);
  }
});
await Promise.all(promises);
