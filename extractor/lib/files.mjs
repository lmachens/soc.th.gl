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

  // Workaround sequence mapping issue in yamljs
  const cleanFile = assetFile
    .replaceAll("m_Curve", "x_Curve")
    .replaceAll(/\s+m_\w+.+/g, "")
    .replaceAll(/_statuses: (\d+)/g, (_, statuses) => {
      // Convert index of BacteriaOwnerStatus
      // e.g. 06000000 to ['Faey'] or 030000000400000005000000 to ['Musician', 'Rana', 'Beast']
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
    .replaceAll(/_/g, "")
    .replaceAll("''", "")
    .replaceAll(/[^']\n\s+\n/g, "")
    .replaceAll(/- '.+[^']\n(.|\n|\t)+?'/g, (a) =>
      a.replaceAll("\n", "<br>").replaceAll("\t", "")
    )
    .replaceAll("<hl>", `<span class="highlight">`)
    .replaceAll("</hl>", "</span>");
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
