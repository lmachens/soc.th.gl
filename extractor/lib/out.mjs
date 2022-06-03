import fs from "node:fs/promises";

export const readJSONFile = async (path) => {
  const file = await fs.readFile(path, "utf-8");
  return JSON.parse(file);
};

export const writeJSONFile = async (docs, collectionName) => {
  const camelCaseCollectionName =
    collectionName.at(0).toLowerCase() + collectionName.slice(1);
  await fs.writeFile(
    `./out/${camelCaseCollectionName}.json`,
    JSON.stringify(docs, null, 2)
  );
};

export const copyImageFile = (filename, folder) =>
  fs.cp(
    `./SongsOfConquest/ExportedProject/Assets/Texture2D/${filename}`,
    `./${folder}/${filename}`
  );
