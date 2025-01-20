import fs from "node:fs/promises";
import yaml from "yamljs";
import camelcaseKeys from "camelcase-keys";

export const readYAMLFile = async (path) => {
  let assetFile = await fs.readFile(path, "utf8");

  if (path.endsWith(".prefab")) {
    const match = assetFile.match(/m_Sprite: {fileID: (\w+), guid: (\w+)/);
    if (!match) {
      return {};
    }
    return {
      sprite: {
        fileId: +match[1],
        guid: match[2],
      },
    };
  }

  const cleanFile = assetFile
    .replaceAll("\r\n", "\n") // Linux line endings
    .replaceAll("m_Curve", "x_Curve") // Specific fix for yamljs issue
    .replaceAll(/_statuses: (\d+)/g, (_, statuses) => {
      const bacteriaOwnerStatus = [
        "Human",
        "Faey",
        "Undead",
        "Musician",
        "Rana",
        "Beast",
        "Harima",
        "Garrison",
      ];
      const parts = statuses
        .match(/(.{1,8})/g)
        .map((part) => bacteriaOwnerStatus[+part[1]]);
      return `_statuses: [${parts.join(", ")}]`;
    })
    // Minimize unnecessary cleaning to avoid breaking nested structures
    .replaceAll("''", "") // Remove unnecessary quotes
    .replaceAll(/[^']\n\s+\n/g, "") // Collapse empty lines
    .replaceAll(/<hl>/g, `<span class=\\"highlight\\">`) // Highlight tags
    .replaceAll(/<\/hl>/g, "</span>");

  const content = yaml.parse(cleanFile);
  const obj = camelcaseKeys(content, { deep: true });

  return obj.monoBehaviour || obj;
};

export const readCSTypes = async (path) => {
  const csFile = await fs.readFile(path, "utf8");
  const matches = csFile.matchAll(/(\w+) = (\d+)/g);
  const types = [...matches].reduce(
    (curr, match) => ({
      ...curr,
      [match[2]]: match[1],
    }),
    {}
  );
  return types;
};
