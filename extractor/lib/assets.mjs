import { readCSTypes, readYAMLFile } from "./files.mjs";
import klaw from "klaw";
import fs from "node:fs/promises";

const cache = JSON.parse(await fs.readFile("./out/cache.json", "utf8"));

export const findManifests = async () => {
  console.log("Searching manifests...");
  const manifests = [];
  for await (const file of klaw("./SongsOfConquest/ExportedProject/Assets")) {
    if (file.path.endsWith("Manifest.asset")) {
      manifests.push(file.path);
    }
  }
  return manifests;
};

export const findAssetByGUID = async ({ guid, fileId }, spriteName) => {
  let filePath = cache[guid];
  if (!filePath) {
    return;
  }
  const processMeta = async (filePath, part) => {
    try {
      if (part !== undefined) {
        filePath = filePath.replace(".png.meta", `_${part}.png.meta`);
      }
      const meta = await readYAMLFile(filePath);

      if (meta.textureImporter) {
        if (!Array.isArray(meta.textureImporter.internalIdToNameTable)) {
          return;
        }
        const texture = meta.textureImporter.internalIdToNameTable.find(
          (item) => item.first.second === fileId
        );
        const name = spriteName || texture?.second;
        if (!name) {
          return null;
        }
        const sprite = meta.textureImporter.spriteSheet.sprites.find(
          (sprite) => sprite.name === name
        );
        if (!sprite) {
          console.log(
            `Trying to find ${name} in next part of ${filePath} ( ${
              (part ?? 0) + 1
            } )`
          );
          const result = await processMeta(filePath, part ? part + 1 : 0);
          if (!result) {
            console.warn(
              `Could not find ${name} in sprite sheet of ${filePath}`
            );
          }
          return result;
        }
        return {
          name: sprite.name,
          spriteSheet: filePath.replace(".meta", "").split(/[\\/]/).at(-1),
          x: sprite.rect.x,
          y: sprite.rect.y,
          width: sprite.rect.width,
          height: sprite.rect.height,
          outline: sprite.outline,
          // physicsShape: sprite.physicsShape,
        };
      }
      return null;
    } catch (e) {
      console.warn(e.message, filePath || guid, fileId, spriteName);
      return null;
    }
  };

  try {
    const result = await processMeta(filePath);
    if (result) {
      return result;
    }
    const assetFilePath = filePath.replace(".meta", "");
    return await readYAMLFile(assetFilePath);
  } catch (error) {
    console.warn(error.message, filePath || guid, fileId, spriteName);
    return null;
  }
};

export const resolveEmbedObjects = async (asset) => {
  if (!asset) {
    return;
  }
  for (const [key, value] of Object.entries(asset)) {
    if (key === "visualsPath") {
      const visualsMeta = await readYAMLFile(
        `./SongsOfConquest/ExportedProject/Assets/Resources/${toCaseSensitivePath(
          value
        )}.asset`
      );
      await resolveEmbedObjects(visualsMeta);
      asset.visuals = visualsMeta;
      if (!asset.visuals.prefab) {
        let prefabName = value
          .split("/")
          .at(-1)
          .replace("Definition", "")
          .replace("Visuals", "")
          .replace("Aurelian", "");
        const faction = value.split("/")[1];
        if (!prefabName.includes(faction)) {
          prefabName = `${faction}${prefabName}`;
        }

        try {
          const prefab = await readYAMLFile(
            `./SongsOfConquest/ExportedProject/Assets/PrefabInstance/${toCaseSensitivePath(
              prefabName
            )}.prefab`
          );
          await resolveEmbedObjects(prefab);
          asset.visuals.prefab = prefab;
          const adventurePrefab = await readYAMLFile(
            `./SongsOfConquest/ExportedProject/Assets/PrefabInstance/${toCaseSensitivePath(
              prefabName + "Hostile"
            )}.prefab`
          );
          await resolveEmbedObjects(adventurePrefab);
          asset.visuals.adventurePrefab = adventurePrefab;
        } catch (e) {
          console.warn(`Could not find prefab for ${value}`);
          if (!asset.visuals.prefab) {
            asset.visuals.prefab = {};
          }
          if (!asset.visuals.adventurePrefab) {
            asset.visuals.adventurePrefab = {};
          }
        }
      }
      continue;
    }
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const entry = value[i];
        if (!entry) {
          console.warn(`Empty entry in ${key}`);
          continue;
        }
        if (entry.guid) {
          value[i] = await findAssetByGUID(entry);
        }
        await resolveEmbedObjects(value[i]);
      }
    } else if (value?.guid) {
      asset[key] = await findAssetByGUID(value);
      await resolveEmbedObjects(asset[key]);
    }
  }
};

const toCaseSensitivePath = (path) => {
  return path
    .split(/[\\/]/)
    .map((part, index, parts) =>
      index !== parts.length - 1 ? part.toLowerCase() : part
    )
    .join("/");
};

const bacteriaModifierTypes = await readCSTypes(
  `./SongsOfConquest/ExportedProject/Assets/Scripts/Lavapotion.SongsOfConquest.GameLogicLayer.Runtime/SongsOfConquest/Common/Bacterias/BacteriaModifierType.cs`
);
const bacteriaTroopRestrictions = await readCSTypes(
  `./SongsOfConquest/ExportedProject/Assets/Scripts/Lavapotion.SongsOfConquest.GameLogicLayer.Runtime/SongsOfConquest/Common/Battle/BattleTroopRestriction.cs`
);
const auraRecipients = await readCSTypes(
  `./SongsOfConquest/ExportedProject/Assets/Scripts/Lavapotion.SongsOfConquest.GameLogicLayer.Runtime/SongsOfConquest/Server/Bacterias/Utilities/AuraRecipients.cs`
);

const resolveTypes = async (asset) => {
  if (asset.generatedEnumName) {
    const types = await readCSTypes(
      `./SongsOfConquest/ExportedProject/Assets/Scripts/AutoGeneratedDef/SongsOfConquest/${asset.generatedEnumName}.cs`
    );
    for (let object of asset.objects) {
      const type = types[object.id] || null;
      object.type = type;

      if (object.modifierData) {
        for (let modifier of object.modifierData) {
          const type = bacteriaModifierTypes[modifier.type];
          modifier.modifier = type;
        }
      }
      await resolveTypes(object);
    }
  }
  if (asset.commanderEnumName) {
    const types = await readCSTypes(
      `./SongsOfConquest/ExportedProject/Assets/Scripts/AutoGeneratedDef/SongsOfConquest/${asset.commanderEnumName}.cs`
    );
    for (let commander of asset.commanders) {
      const type = types[commander.id];
      commander.type = type;
    }
  }
  if (asset.restriction) {
    asset.restriction = bacteriaTroopRestrictions[asset.restriction];
  }
  if (asset.auraSettings) {
    asset.auraSettings = {
      ...asset.auraSettings,
      recipients: auraRecipients[asset.auraSettings.recipients],
      hexRadius: asset.auraSettings.hexRadius,
    };
  }
};

const resolveVisualPath = async (asset) => {
  for (let object of asset.objects) {
    if (object.visualPath) {
      const meta = await readYAMLFile(
        `SongsOfConquest/ExportedProject/Assets/Resources/${toCaseSensitivePath(
          object.visualPath
        )}.asset`
      );
      if (meta.bannerSprite) {
        const guid = meta.bannerSprite.guid;
        await resolveEmbedObjects(meta);
        object.bannerSprite = meta.bannerSprite;
        // We like TopCircleSymbol too for factions
        try {
          object.symbolSprite = await findAssetByGUID(
            {
              fileId: -1,
              guid: guid,
            },
            "TopCircleSymbol"
          );
        } catch (e) {
          // Will fail for neutral
        }
      }
      if (meta.wielderFrames?.commanderFrames) {
        object.wielderFrames = [];
        for (const commanderFrame of meta.wielderFrames.commanderFrames) {
          const wielderFrame = await findAssetByGUID(commanderFrame);
          object.wielderFrames.push(wielderFrame);
        }
      }
    }
  }
};

export const buildAssetByManifest = async (path) => {
  const asset = await readYAMLFile(path);
  if (!asset.objects) {
    return;
  }
  await resolveEmbedObjects(asset);
  await resolveTypes(asset);
  await resolveVisualPath(asset);
  return asset.objects;
};
