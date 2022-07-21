import { copyImageFile, readJSONFile, writeJSONFile } from "./lib/out.mjs";

const bacteriasSrc = await readJSONFile("./out/bacteria.json");
const skillsSrc = await readJSONFile("./out/skill.json");
const factionsSrc = await readJSONFile("./out/faction.json");
const skillPoolsSrc = await readJSONFile("./out/skillPool.json");
const troopAbilitiesSrc = await readJSONFile("./out/troopAbility.json");
const artifactsSrc = await readJSONFile("./out/artifact.json");
const termMapSrc = await readJSONFile("./out/termMap.json");
const iconsSrc = await readJSONFile("./out/icons.json");
const spellsSrc = await readJSONFile("./out/spell.json");
const battleMapEntitySrc = await readJSONFile("./out/battleMapEntity.json");

const adventureMapEntitySrc = await readJSONFile(
  "./out/adventureMapEntity.json"
);

await writeJSONFile(termMapSrc, "../../lib/collections/termMap");

const RESOURCE_TYPES = [
  "Gold",
  "Wood",
  "Stone",
  "AncientAmber",
  "Glimmerweave",
  "CelestialOre",
];
const UPGRADED_TYPES = ["vanilla", "upgraded", "superUpgraded"];
const ESSENCE_TYPES = [
  null,
  "Order",
  "Creation",
  "Chaos",
  "Arcana",
  "Destruction",
];
const SPELL_TARGET_TYPES = [
  "Empty",
  "Friendly",
  "Enemy",
  "AllFriendlies",
  "AllEnemies",
  "RangedFriendly",
  "RangedEnemy",
  "AllRangedFriendlies",
  "AllRangedEnemies",
  "AllWithBacteriaType",
  "FriendlyCommander",
  "EnemyCommander",
  "Tiles",
  "AllTroops",
  "TilesInCircle",
  "Troop",
];
const SPELL_EFFECT_TYPES = ["AddBacteria", "Teleport", "Summon"];

const SPELL_TELEPORT_DESTINATIONS = ["Tile", "Troop", "RandomNeighbour"];

const BACTERIA_DURATION_TYPES = [
  "BattleStackRound",
  "BattleRound",
  "EntireBattle",
  "Permanent",
  "Once",
  "AdventureRound",
  "AdventureChapter",
  "AdventureTeamRound",
  "AdventureNumberOfBattles",
  "CurrentBattleStackTurn",
  "OwnerAttacks",
  "OwnerWasAttacked",
  "OwnerWasDamaged",
  "BattleStackRoundWithTail",
];
const SPELL_DURATION_TYPES = [
  "BattleStackRound",
  "BattleRound",
  "EntireBattle",
  "Permanent",
  "Once",
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  "OwnerAttacks",
  "OwnerWasAttacked",
  "OwnerWasDamaged",
  "BattleStackRoundWithTail",
];
const GENERIC_BACTERIA_CUSTOM_EFFECT = [
  "None",
  "Damage",
  "KillAmount",
  "Refresh",
  "Weary",
  "InvulnerableRestriction",
  "TargetAdjacent",
  null,
  "ChainFromTarget",
  "Push",
  "Aura",
  "GenerateEssence",
];

const factions = factionsSrc.map((factionSrc) => ({
  id: factionSrc.id,
  type: factionSrc.type,
  languageKey: factionSrc.languageKey,
  bannerSprite: factionSrc.bannerSprite,
  symbolSprite: factionSrc.symbolSprite,
  wielderFrames: factionSrc.wielderFrames,
  commanders: factionSrc.commanders
    .filter((commander) => commander.type && commander.usageType === 0)
    .map((commander) => ({
      type: commander.type,
      portrait: {
        name: commander.portrait.name,
        spriteSheet: commander.portrait.spriteSheet,
        x: commander.portrait.x,
        y: commander.portrait.y,
        width: commander.portrait.width,
        height: commander.portrait.height,
      },
    })),
  units: factionSrc.units.map((unit) => ({
    vanilla: {
      languageKey: unit.vanilla.languageKey,
      sprite: unit.vanilla.visuals?.prefab.sprite,
      adventureSprite: unit.vanilla.visuals?.adventurePrefab.sprite,
    },
    upgraded: unit.upgraded.languageKey
      ? {
          languageKey: unit.upgraded.languageKey,
          sprite: unit.upgraded.visuals?.adventurePrefab.sprite,
        }
      : null,
    superUpgraded: unit.superUpgraded.languageKey
      ? {
          languageKey: unit.superUpgraded.languageKey,
          sprite: unit.superUpgraded.visuals?.adventurePrefab.sprite,
        }
      : null,
  })),
}));

await writeJSONFile(factions, "../../lib/collections/factions");

for (const faction of factions) {
  for (const wielderFrame of faction.wielderFrames) {
    await copyImageFile(wielderFrame.spriteSheet, "../public/factions");
  }
}

const getBacteria = ({ bacteriaType, duration }) => {
  const bacteria = bacteriasSrc.find(
    (bacteriaSrc) => bacteriaSrc.id === bacteriaType
  );
  if (!bacteria) {
    console.warn(`Can not find bacteria ${bacteriaType}`);
    return null;
  }
  const result = {
    bacteriaType: bacteria.id,
    type: bacteria.type,
    restriction: bacteria.restriction,
    customEffect: GENERIC_BACTERIA_CUSTOM_EFFECT[bacteria.customEffect],
    customEffectValue: bacteria.customEffectValue,
    secondaryCustomEffectValue: bacteria.secondaryCustomEffectValue,
    auraSettings: bacteria.auraSettings,
    modifierData: [],
    resourcesIncome:
      bacteria.income?.resources.map((resource) => ({
        type: RESOURCE_TYPES[resource.type],
        amount: resource.amount,
        allTimeAmount: resource.allTimeAmount,
      })) || [],
    duration: duration,
  };

  if (
    typeof duration.duration !== "undefined" &&
    typeof duration.type === "undefined"
  ) {
    console.log(bacteriaType, duration);
  }

  if (bacteria.auraSettings?.bacteriaToAdd?.bacteriaType) {
    const bacteriaToAdd = getBacteria({
      bacteriaType: bacteria.auraSettings.bacteriaToAdd.bacteriaType,
      duration: {
        type:
          typeof bacteria.auraSettings.bacteriaToAdd.duration.type === "number"
            ? BACTERIA_DURATION_TYPES[
                bacteria.auraSettings.bacteriaToAdd.duration.type
              ]
            : bacteria.auraSettings.bacteriaToAdd.duration.type,
        duration: bacteria.auraSettings.bacteriaToAdd.duration.duration,
      },
    });
    if (bacteriaToAdd) {
      result.auraSettings.bacteriaToAdd = bacteriaToAdd;
      bacteriaToAdd.modifierData =
        bacteriaToAdd.modifierData?.map((modifier) => ({
          type: modifier.type,
          modifier: modifier.modifier,
          amountToAdd: modifier.amountToAdd,
          applicationType: modifier.applicationType,
        })) || [];
    } else {
      result.auraSettings.bacteriaToAdd = null;
    }
  } else {
    if (result.auraSettings) {
      result.auraSettings.bacteriaToAdd = null;
    }
    result.modifierData =
      bacteria.modifierData?.map((modifier) => ({
        type: modifier.type,
        modifier: modifier.modifier,
        amountToAdd: modifier.amountToAdd,
        applicationType: modifier.applicationType,
      })) || [];
  }

  if (bacteria.settings?.bacterias) {
    result.settings = {
      bacterias: bacteria.settings.bacterias.map((bacteria) =>
        getBacteria({
          bacteriaType: bacteria.bacteriaType,
          duration: {
            type: BACTERIA_DURATION_TYPES[bacteria.duration.type],
            duration: bacteria.duration.duration,
          },
        })
      ),
    };
  }
  return result;
};

const getSimpleSkill = ({ skill, level }) => {
  return {
    type: skillsSrc.find((skillSrc) => skillSrc.id === skill).type,
    level: level,
  };
};
const UNIT_TYPES = ["vanilla", "upgraded", "superUpgraded"];
const SKILL_POOL_EVALUATION = ["LevelRange", "LevelInterval"];
const getUnit = ({ factionIndex, unitIndex, upgradeType }) => {
  const unitType = UNIT_TYPES[upgradeType];
  return factions[factionIndex].units[unitIndex][unitType];
};
const wielders = factionsSrc
  .map((factionSrc) =>
    factionSrc.commanders
      .filter((commander) => commander.type && commander.usageType === 0)
      .map((commander) => {
        const skillPool = skillPoolsSrc.find(
          (skillPoolSrc) => skillPoolSrc.id === commander.skillPool
        );

        const startingSkills = commander.skills.map(getSimpleSkill);

        const skillPools = skillPool.pools.map((pool) => ({
          name: pool.name,
          evaluationType: SKILL_POOL_EVALUATION[pool.evaluationType],
          levelRange: pool.levelRange,
          levelIntervalStartLevel: pool.levelIntervalStartLevel,
          levelInterval: pool.levelInterval,
          skills: pool.skills.map((skill) => {
            const type = skillsSrc.find(
              (skillSrc) => skillSrc.id === skill.skill
            ).type;
            return {
              type: type,
              requiresSkill: skill.requiresSkill ? true : false,
              requirementType:
                skill.requirementType === 0 ? "RequireAny" : "RequireAll",
              requiredSkills: skill.requiredSkills.map(getSimpleSkill),
            };
          }),
        }));

        return {
          type: commander.type,
          faction: factionSrc.languageKey,
          portrait: {
            name: commander.portrait.name,
            spriteSheet: commander.portrait.spriteSheet,
            x: commander.portrait.x,
            y: commander.portrait.y,
            width: commander.portrait.width,
            height: commander.portrait.height,
          },
          stats: {
            defense: commander.stats.defense,
            offense: commander.stats.offense,
            movement: commander.stats.movement,
            viewRadius: commander.stats.viewRadius,
            command: commander.stats.command,
          },
          startingSkills: startingSkills,
          skillPools: skillPools,
          units: commander.units.map((unit) => ({
            languageKey: getUnit(unit).languageKey,
            size: unit.size,
          })),
          specializations: commander.specializations.map((bacteria) =>
            getBacteria({
              bacteriaType: bacteria.bacteriaType,
              duration: {
                type: BACTERIA_DURATION_TYPES[bacteria.duration.type],
                duration: bacteria.duration.duration,
              },
            })
          ),
        };
      })
  )
  .flat();

await writeJSONFile(wielders, "../../lib/collections/wielders");

for (const wielder of wielders) {
  await copyImageFile(wielder.portrait.spriteSheet, "../public/wielders");
}

const getTroopAbility = (id) => {
  const ability = troopAbilitiesSrc.find((ability) => ability.id === id);
  if (ability.type === "None") {
    return null;
  }
  return {
    type: ability.type,
    icon: ability.icon,
    bacterias: ability.bacterias.map((bacteria) =>
      getBacteria({
        bacteriaType: bacteria.bacteriaType,
        duration: {
          type: BACTERIA_DURATION_TYPES[bacteria.duration.type],
          duration: bacteria.duration.duration,
        },
      })
    ),
  };
};

const getUnitType = (type) => ({
  languageKey: type.languageKey,
  sprite: type.visuals.prefab.sprite,
  purchaseCost: {
    costEntries: type.purchaseCost.costEntries.map((costEntry) => ({
      type: RESOURCE_TYPES[costEntry.type],
      amount: costEntry.amount,
    })),
  },
  obsoleteGoldCost: type.obsoleteGoldCost,
  stats: type.stats,
  troopAbility: getTroopAbility(type.troopAbility),
  bacterias: type.bacterias.map((bacteria) =>
    getBacteria({
      bacteriaType: bacteria.bacteriaType,
      duration: {
        type: BACTERIA_DURATION_TYPES[bacteria.duration.type],
        duration: bacteria.duration.duration,
      },
    })
  ),
});
const units = factionsSrc
  .map((factionSrc) =>
    factionSrc.units.map((unit) => ({
      faction: factionSrc.languageKey,
      vanilla: getUnitType(unit.vanilla),
      upgraded: unit.upgraded.languageKey ? getUnitType(unit.upgraded) : null,
      superUpgraded: unit.superUpgraded.languageKey
        ? getUnitType(unit.superUpgraded)
        : null,
    }))
  )
  .flat();

await writeJSONFile(units, "../../lib/collections/units");

const skills = skillsSrc.map((skillSrc) => ({
  type: skillSrc.type,
  icon: skillSrc.icon,
  levels: skillSrc.levels.map((level) => {
    const levelBacteria = level.bacterias[0];
    return getBacteria({
      bacteriaType: levelBacteria.type,
      duration: {
        type: BACTERIA_DURATION_TYPES[levelBacteria.duration.type],
        duration: levelBacteria.duration.duration,
      },
    });
  }),
}));

await writeJSONFile(skills, "../../lib/collections/skills");

const skillPools = skillPoolsSrc.map((skillPool) => ({
  id: skillPool.id,
  type: skillPool.type,
  pools: skillPool.pools,
}));

await writeJSONFile(skillPools, "../../lib/collections/skillPools");

const artifacts = artifactsSrc.map((artifact) => ({
  id: artifact.id,
  type: artifact.type,
  icon: artifact.icon,
  bacterias: artifact.bacterias.map((bacteria) =>
    getBacteria({
      bacteriaType: bacteria.bacteriaType,
      duration: {
        type: BACTERIA_DURATION_TYPES[bacteria.duration.type],
        duration: bacteria.duration.duration,
      },
    })
  ),
}));

await writeJSONFile(artifacts, "../../lib/collections/artifacts");
for (const artifact of artifacts) {
  await copyImageFile(artifact.icon.spriteSheet, "../public/artifacts");
}

await writeJSONFile(iconsSrc, "../../lib/collections/icons");
for (const icon of iconsSrc) {
  await copyImageFile(icon.spriteSheet, "../public/icons");
}

const buildSites = adventureMapEntitySrc.filter((mapEntity) =>
  mapEntity.nameKey.startsWith("MapEntities/BuildSite")
);
const buildings = [];
for (const buildSite of buildSites) {
  for (const component of buildSite.components) {
    if (component.actionProviders) {
      for (const actionProvider of component.actionProviders) {
        if (actionProvider.availableBuildings) {
          for (const availableBuilding of actionProvider.availableBuildings) {
            const factionId = availableBuilding.factionId;
            for (const availableMapEntity of availableBuilding.availableMapEntities) {
              const mapEntity = availableMapEntity.mapEntityBlueprint;
              if (
                buildings.some(
                  (someBuilding) => someBuilding.id === mapEntity.id
                )
              ) {
                continue;
              }
              const building = {
                id: mapEntity.id,
                factionId,
                buildSite: buildSite.nameKey,
                nameKey: mapEntity.nameKey,
                descriptionKey: mapEntity.descriptionKey,
                portraits: mapEntity.portraitSettings.map(
                  (portraitSetting) => portraitSetting.portrait
                ),
                // category: mapEntity.category,
              };

              const incomeDefinitionComponent = mapEntity.components.find(
                (component) => component.incomeDefinition?.incomePerLevel
              );
              if (incomeDefinitionComponent) {
                building.incomePerLevel =
                  incomeDefinitionComponent.incomeDefinition.incomePerLevel.map(
                    (incomePerLevel) => ({
                      level: incomePerLevel.level,
                      resources: incomePerLevel.definition.resources.map(
                        (resource) => ({
                          type: RESOURCE_TYPES[resource.type],
                          amount: resource.amount,
                        })
                      ),
                      troopIncomes: incomePerLevel.definition.troopIncomes.map(
                        (troopIncome) => {
                          const faction =
                            factionsSrc[troopIncome.reference.factionIndex];
                          const upgradeType =
                            UPGRADED_TYPES[troopIncome.reference.upgradeType];
                          const unit =
                            faction.units[troopIncome.reference.unitIndex][
                              upgradeType
                            ];
                          return {
                            factionKey: faction.languageKey,
                            upgradeType,
                            unitKey: unit.languageKey,
                            size: troopIncome.reference.size,
                            requiredResearch: troopIncome.requiredResearch,
                            initialInstantIncome:
                              troopIncome.initialInstantIncome,
                          };
                        }
                      ),
                    })
                  );
              }

              const baseViewRadiusComponent = mapEntity.components.find(
                (component) => component.baseViewRadius
              );
              building.baseViewRadius = baseViewRadiusComponent.baseViewRadius;

              const levelUpgradesComponent = mapEntity.components.find(
                (component) => component.levelUpgrades
              );
              if (levelUpgradesComponent) {
                building.levelUpgrades =
                  levelUpgradesComponent.levelUpgrades.map((levelUpgrade) => ({
                    costEntries: levelUpgrade.requirements.cost.costEntries.map(
                      (costEntry) => ({
                        type: RESOURCE_TYPES[costEntry.type],
                        amount: costEntry.amount,
                      })
                    ),
                    requiredBuildings:
                      levelUpgrade.requirements.requiredBuildings.map(
                        (requiredBuilding) => requiredBuilding.entity
                      ),
                  }));
              }

              const requirementsComponent = mapEntity.components.find(
                (component) => component.requirements
              );
              building.requirements = {
                costEntries:
                  requirementsComponent.requirements.cost.costEntries.map(
                    (costEntry) => ({
                      type: RESOURCE_TYPES[costEntry.type],
                      amount: costEntry.amount,
                    })
                  ),
                requiredBuildings:
                  requirementsComponent.requirements.requiredBuildings.map(
                    (requiredBuilding) => requiredBuilding.entity
                  ),
              };

              const maxGarrison = mapEntity.components.find(
                (component) => component.maxGarrison
              );
              if (maxGarrison) {
                building.maxGarrison = maxGarrison;
              }

              buildings.push(building);
            }
          }
        }
      }
    }
  }
}

await writeJSONFile(buildings, "../../lib/collections/buildings");
for (const building of buildings) {
  for (const portrait of building.portraits) {
    await copyImageFile(portrait.spriteSheet, "../public/buildings");
  }
}

const getBattleMapEntity = (id) => {
  const battleMapEntity = battleMapEntitySrc.find(
    (battleMapEntity) => battleMapEntity.id === id
  );
  if (!battleMapEntity) {
    return null;
  }
  const healthComponent = battleMapEntity.components.find(
    (component) => typeof component.health !== "undefined"
  );

  const bacterias = battleMapEntity.bacterias.length
    ? battleMapEntity.bacterias.map((bacteria) =>
        getBacteria({
          bacteriaType: bacteria.bacteriaType,
          duration: {
            type: SPELL_DURATION_TYPES[bacteria.duration.type],
            duration: bacteria.duration.duration,
          },
        })
      )
    : null;
  return {
    nameKey: battleMapEntity.nameKey,
    entityHealthPoints: healthComponent ? healthComponent.health : null,
    bacterias,
  };
};

const spells = spellsSrc.map((spell) => ({
  id: spell.id,
  icon: spell.icon,
  type: spell.type,
  nameKey: spell.nameKey,
  descriptionKey: spell.descriptionKey,
  costs: spell.cost.map((cost) => ({
    type: ESSENCE_TYPES[cost.type],
    amount: cost.amount,
  })),
  tiers: spell.tiers.map((tier) => ({
    tier: tier.tier,
    effectType: SPELL_EFFECT_TYPES[tier.effectType],
    amountOfTargets: tier.amountOfTargets,
    teleportDestination: SPELL_TELEPORT_DESTINATIONS[tier.teleportDestination],
    maxTeleportRange: tier.maxTeleportRange,
    circleRadius: tier.circleRadius,
    numberOfTargetTiles: tier.relativeTargetTiles?.length || null,
    target: SPELL_TARGET_TYPES[tier.target],
    requiredCommanderSkills: tier.requiredCommanderSkills.map(getSimpleSkill),
    mapEntityToSummon: tier.mapEntityToSummon
      ? getBattleMapEntity(tier.mapEntityToSummon)
      : null,
    bacterias: tier.bacterias.map((bacteria) =>
      getBacteria({
        bacteriaType: bacteria.bacteriaType,
        duration: {
          type: SPELL_DURATION_TYPES[bacteria.duration.type],
          duration: bacteria.duration.value,
        },
      })
    ),
  })),
}));
await writeJSONFile(spells, "../../lib/collections/spells");
for (const spell of spells) {
  await copyImageFile(spell.icon.spriteSheet, "../public/spells");
}
