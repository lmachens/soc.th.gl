import randomEventsCollection from "./collections/randomEvents.json";
import factionsCollection from "./collections/factions.json";
import unitsCollection from "./collections/units.json";
import { getTerm } from "./terms";
import startCase from "lodash.startcase";

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
        const unit = unitsCollection[randomEventSrc.recipientUnitIndex];
        eventRecipientPlaceholder.push(
          recipientName,
          getTerm(
            `${unit.faction}/${
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
        const unit = unitsCollection[randomEventSrc.recipientUnitIndex];
        eventRecipientPlaceholder.push(
          recipientName,
          getTerm(
            `${unit.faction}/${
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
};
