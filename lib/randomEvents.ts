import randomEventsCollection from "./collections/randomEvents.json";
import factionsCollection from "./collections/factions.json";
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
    requirementEvaluationType: randomEventSrc.requirementEvaluationType,
    requirements: randomEventSrc.requirements.map((requirement) => {
      const placeholder: string[] = [];
      // See extractor/SongsOfConquest/ExportedProject/Assets/MonoScript/Lavapotion.SongsOfConquest.UILayer.Runtime/SongsOfConquest/Client/Adventure/RandomEventExplanationDetails.cs
      switch (requirement.requirementType) {
        case "GreaterThanOrEqualRound":
        case "LessThanRound":
        case "GreaterThanOrEqualBattlesWon":
        case "GreaterThanOrEqualBattlesLost":
        case "GreaterThanOrEqualBattlesFought":
          placeholder.push(requirement.value.toString());
          break;

        case "GreaterThanOrEqualToResourceIncome":
        case "GreaterThanOrEqualToResourceOwned":
          {
            placeholder.push(
              `${requirement.value.toString()} ${getTerm(
                `Common/Resource/${requirement.resourceType}`,
                locale
              )}`
            );
          }
          break;

        case "PriorEventDidHappen":
        case "PriorEventDidNotHappen":
          placeholder.push(
            getTerm(
              `RandomEvents/${requirement.eventReference.uniqueName}`,
              locale
            )
          );
          break;

        case "GreaterThanOrEqualEntitiesOwned":
        case "LessThanEntitiesOwned":
          placeholder.push(
            requirement.value.toString(),
            getTerm(requirement.entityType.nameKey, locale)
          );
          break;

        case "RecipientOwnsArtifact":
        case "RecipientEquippedArtifact":
          placeholder.push(
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
            placeholder.push(
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
          placeholder
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
  requirements: {
    requirementType: string;
  }[];
};
