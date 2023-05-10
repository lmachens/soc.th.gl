import startCase from "lodash.startcase";
import { BacteriaDTO, getLocaleBacteria } from "./bacterias";
import factionsCollection from "./collections/factions.json";
import randomEventsCollection from "./collections/randomEvents.json";
import unitsCollection from "./collections/units.json";
import { getTerm } from "./terms";

export const getRandomEvents = (locale: string) => {
  const randomEvents = randomEventsCollection.map<RandomEventSimpleDTO>(
    (randomEvent) => {
      return {
        id: randomEvent.id,
        name: getTerm(`RandomEvents/${randomEvent.uniqueName}`, locale),
        description: getTerm(randomEvent.descriptionKey, locale),
        factionName:
          randomEvent.faction === "Generic"
            ? "Generic"
            : getTerm(`Factions/${randomEvent.faction}/Name`, locale),
      };
    }
  );
  return randomEvents;
};

export const getRandomEvent = (
  id: string,
  locale: string
): RandomEventDTO | null => {
  const randomEventSrc = randomEventsCollection.find(
    (randomEvent) => randomEvent.id === id
  );
  if (!randomEventSrc) {
    return null;
  }

  const eventRecipientPlaceholder: string[] = [];
  const recipientName = startCase(randomEventSrc.eventRecipient).replace(
    "Commander",
    "Wielder"
  );
  // See extractor/SongsOfConquest/ExportedProject/Assets/MonoScript/Lavapotion.SongsOfConquest.UILayer.Runtime/SongsOfConquest/Client/Adventure/RandomEventMenu.cs
  switch (randomEventSrc.eventRecipient) {
    case "CommanderWithSpecificOwnedArtifact":
    case "CommanderWithSpecificEquippedArtifact":
      eventRecipientPlaceholder.push(
        recipientName,
        getTerm(
          `Artifacts/${randomEventSrc.recipientArtifactType}/Name`,
          locale
        )
      );
      break;
    case "CommanderClosestToTotalTroopSize":
    case "CommanderClosestToLevel":
    case "CommanderClosestToArmyValue":
    case "CommanderClosestToExperience":
      eventRecipientPlaceholder.push(
        recipientName,
        randomEventSrc.recipientValue.toString()
      );
      break;
    case "CommanderWithSpecificTroop":
      {
        const faction = factionsCollection.find(
          (faction) => faction.id === randomEventSrc.recipientFactionIndex
        )!;
        const unit = faction.units[randomEventSrc.recipientUnitIndex];
        eventRecipientPlaceholder.push(
          recipientName,
          getTerm(
            `${faction.languageKey}/${
              // @ts-ignore
              unit[randomEventSrc.recipientTroopUpgradeType].languageKey
            }/Name`,
            locale
          )
        );
      }
      break;
    case "CommanderWithSpecificTroopOfAtLeastSize":
      {
        const faction = factionsCollection.find(
          (faction) => faction.id === randomEventSrc.recipientFactionIndex
        )!;
        const unit = faction.units[randomEventSrc.recipientUnitIndex];
        eventRecipientPlaceholder.push(
          recipientName,
          getTerm(
            `${faction.languageKey}/${
              // @ts-ignore
              unit[randomEventSrc.recipientTroopUpgradeType].languageKey
            }/Name`,
            locale
          ),
          randomEventSrc.recipientValue.toString()
        );
      }
      break;
    case "CommanderWithLeastArmyValue":
    case "CommanderWithMostArmyValue":
    case "CommanderWithLowestLevel":
    case "CommanderWithHighestLevel":
    case "CommanderWithLowestExperienceAmount":
    case "CommanderWithHighestExperienceAmount":
    case "CommanderWithMostOwnedArtifacts":
    case "CommanderWithLeastOwnedArtifacts":
    case "CommanderWithMostEquippedArtifacts":
    case "CommanderWithLeastEquippedArtifacts":
      eventRecipientPlaceholder.push(recipientName);
      break;
  }
  return {
    id: randomEventSrc.id,
    name: getTerm(`RandomEvents/${randomEventSrc.uniqueName}`, locale),
    description: getTerm(randomEventSrc.descriptionKey, locale),
    factionName:
      randomEventSrc.faction === "Generic"
        ? "Generic"
        : getTerm(`Factions/${randomEventSrc.faction}/Name`, locale),
    chanceOfHappening: randomEventSrc.chanceOfHappening,
    eventChainName: randomEventSrc.eventChainNameKey
      ? getTerm(randomEventSrc.eventChainNameKey, locale)
      : null,
    eventRecipient: getTerm(
      `Adventure/RandomEventsMenu/Recipient/${randomEventSrc.eventType}/${randomEventSrc.eventRecipient}`,
      locale,
      eventRecipientPlaceholder
    ),
    requirementEvaluationType: randomEventSrc.requirementEvaluationType,
    requirements: randomEventSrc.requirements.map((requirement) => {
      const requirementPlaceholder: string[] = [];
      // See extractor/SongsOfConquest/ExportedProject/Assets/MonoScript/Lavapotion.SongsOfConquest.UILayer.Runtime/SongsOfConquest/Client/Adventure/RandomEventExplanationDetails.cs
      switch (requirement.requirementType) {
        case "GreaterThanOrEqualRound":
        case "LessThanRound":
        case "GreaterThanOrEqualBattlesWon":
        case "GreaterThanOrEqualBattlesLost":
        case "GreaterThanOrEqualBattlesFought":
          requirementPlaceholder.push(requirement.value.toString());
          break;

        case "GreaterThanOrEqualToResourceIncome":
        case "GreaterThanOrEqualToResourceOwned":
          {
            requirementPlaceholder.push(
              `${requirement.value.toString()} ${getTerm(
                `Common/Resource/${requirement.resourceType}`,
                locale
              )}`
            );
          }
          break;

        case "PriorEventDidHappen":
        case "PriorEventDidNotHappen":
          requirementPlaceholder.push(
            getTerm(
              `RandomEvents/${requirement.eventReference.uniqueName}`,
              locale
            )
          );
          break;

        case "GreaterThanOrEqualEntitiesOwned":
        case "LessThanEntitiesOwned":
          requirementPlaceholder.push(
            requirement.value.toString(),
            getTerm(requirement.entityType.nameKey, locale)
          );
          break;

        case "RecipientOwnsArtifact":
        case "RecipientEquippedArtifact":
          requirementPlaceholder.push(
            randomEventSrc.eventRecipient,
            // @ts-ignore (No event like this exists yet)
            requirement.artifactType
          );
          break;

        case "RecipientOwnsGreaterThanOrEqualTroop":
        case "RecipientOwnsLessThanTroop":
        case "TroopIncomeGreaterThanOrEqual":
        case "TroopIncomeLessThan":
          {
            const faction = factionsCollection[requirement.factionIndex];
            const unit = unitsCollection[requirement.unitIndex];
            requirementPlaceholder.push(
              randomEventSrc.eventRecipient,
              requirement.value.toString(),
              getTerm(`Factions/${faction.languageKey}/Name`, locale),
              getTerm(
                `${unit.faction}/${unit.vanilla.languageKey}/Name`,
                locale
              )
            );
          }
          break;
      }
      return {
        ...requirement,
        requirementType: getTerm(
          `Adventure/RandomEventsMenu/Details/Requirement/${requirement.requirementType}`,
          locale,
          requirementPlaceholder
        ),
      };
    }),
    rewards: randomEventSrc.rewards.map((reward) => {
      let result: string | BacteriaDTO = "";
      // extractor/SongsOfConquest/ExportedProject/Assets/MonoScript/Lavapotion.SongsOfConquest.GameLogicLayer.Runtime/SongsOfConquest/Common/Rewards/RuntimeRewardExtensions.cs
      switch (reward.rewardType) {
        case "Troops":
          result = reward.troopRewards
            .map(
              (troop) =>
                `${troop.size} ${getTerm(
                  `${troop.faction}/${troop.name}/Name`,
                  locale
                )}`
            )
            .join(", ");

          break;
        case "Resource":
        case "RandomExoticResource":
          result = `You get ${reward.resourceReward.amountMinMax.min}-${
            reward.resourceReward.amountMinMax.max
          } ${getTerm(
            `Common/Resource/${reward.resourceReward.type}`,
            locale
          )}`;
          break;
        case "RandomTroopInFaction":
          // There is no RandomTroopInFaction type right now
          break;
        case "Bacteria":
          result = getLocaleBacteria(reward.bacteriaReward!, locale);
          break;
        case "Experience":
          result = getTerm(`MapEntities/Generic/Reward/Experience`, locale, [
            "",
            reward.experience,
          ]);
          break;
        case "Artifact":
          result = getTerm(`Artifacts/${reward.artifactReward}/Name`, locale);
          break;
        case "RandomArtifact":
          // There is no RandomArtifact right now
          result = `Get's a random artifact`;
          break;
        case "Level":
          result = getTerm(
            `MapEntities/Generic/Reward/Level`,
            locale,
            reward.levelReward
          );
          break;
        case "StoryObjective":
          break;
        case "Skill":
          // There is no Skill right now
          break;
        case "RandomSkill":
          // There is no RandomSkill right now
          break;
      }

      return result;
    }),
    penalties: randomEventSrc.penalties.map((penalty) => {
      // extractor/SongsOfConquest/ExportedProject/Assets/MonoScript/Lavapotion.SongsOfConquest.GameLogicLayer.Runtime/SongsOfConquest/Common/Penalties/RuntimePenaltyExtensions.cs
      let text = "";

      switch (penalty.penaltyType) {
        case "LoseResource":
          text = `You lose ${penalty.resourcePenalty.amountMinMax.min}-${
            penalty.resourcePenalty.amountMinMax.max
          } ${getTerm(
            `Common/Resource/${penalty.resourcePenalty.type}`,
            locale
          )}`;
          break;
        case "DestroyOwnedBuilding":
          text = getTerm(
            `MapEntities/Generic/Penalty/DestroyOwnedBuilding${
              penalty.destroyOwnedBuilding.destroyAll ? "/All" : ""
            }`,
            locale,
            [
              penalty.destroyOwnedBuilding.amount,
              getTerm(penalty.destroyOwnedBuilding.buildingToDestroy, locale),
            ]
          );
          break;
        case "CreateHostile":
          // There is no CreateHostile penalty type right now
          break;
        case "CreateRandomHostile":
          text = getTerm(
            `MapEntities/Generic/Penalty/CreateRandomHostile/${penalty.createRandomHostile.spawnLocation}`,
            locale,
            [penalty.createRandomHostile.amountOfHostiles]
          );
          break;
        case "ReduceRecruitmentPool":
          text = getTerm(
            `MapEntities/Generic/Penalty/ReduceRecruitmentPool`,
            locale,
            {
              reducePercent: penalty.reduceRecruitmentPool.percentage * 100,
              commaSeparatedTroopNames:
                penalty.reduceRecruitmentPool.troopsToReduce
                  .map((troop) =>
                    getTerm(`${troop.faction}/${troop.name}`, locale)
                  )
                  .join(", "),
            }
          );
          break;
      }
      return text;
    }),
  };
};

export type RandomEventSimpleDTO = {
  id: string;
  name: string;
  description: string;
  factionName: string;
};

export type RandomEventDTO = {
  id: string;
  name: string;
  description: string;
  factionName: string;
  eventChainName: string | null;
  chanceOfHappening: number;
  requirementEvaluationType: string;
  eventRecipient: string;
  requirements: {
    requirementType: string;
  }[];
  rewards: (BacteriaDTO | string)[];
  penalties: string[];
};
