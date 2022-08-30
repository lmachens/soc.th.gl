import randomEventsCollection from "./collections/randomEvents.json";
import { getTerm } from "./terms";

export const getRandomEvents = (locale: string) => {
  const randomEvents = randomEventsCollection.map<RandomEventSimpleDTO>(
    (randomEvent) => {
      return {
        id: randomEvent.uniqueName,
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
  name: string,
  locale: string
): RandomEventDTO | null => {
  const randomEventSrc = randomEventsCollection.find(
    (randomEvent) => randomEvent.name === name
  );
  if (!randomEventSrc) {
    return null;
  }
  return null;
};

//   const randomEvent: RandomEventDTO = {
//     id: randomEventSrc.id,
//     type: randomEventSrc.nameKey,
//     factionId: randomEventSrc.factionId,
//     factionName: factions.find(
//       (faction) => faction.id === randomEventSrc
// .factionId
//     )!.name,
//     name: getTerm(randomEventSrc
// .nameKey, locale),
//     description: getTerm(randomEventSrc
// .descriptionKey, locale),
//     portraits: randomEventSrc.portraits,
//     baseViewRadius: randomEventSrc.baseViewRadius,
//     requirements: {
//       costEntries: randomEventSrc
// .requirements.costEntries.map((costEntry) => ({
//         type: getTerm(`Common/Resource/${costEntry.type}`, locale),
//         amount: costEntry.amount,
//       })),
//       requiredBuildings: randomEventSrc
// .requirements.requiredBuildings.map(
//         (buildingId) =>
//           getTerm(
//             randomEventsCollection.find((randomEvent) => randomEvent.id === buildingId)!
//               .nameKey,
//             locale
//           )
//       ),
//     },
//   };
//   if (randomEventSrc.levelUpgrades) {
//     randomEvent.levelUpgrades = randomEventSrc.levelUpgrades.map((levelUpgrade) => ({
//       costEntries: levelUpgrade.costEntries.map((costEntry) => ({
//         type: getTerm(`Common/Resource/${costEntry.type}`, locale),
//         amount: costEntry.amount,
//       })),
//       requiredBuildings: levelUpgrade.requiredBuildings.map((buildingId) =>
//         getTerm(
//           randomEventsCollection.find((randomEvent) => randomEvent.id === buildingId)!
//             .nameKey,
//           locale
//         )
//       ),
//     }));
//   }
//   if (randomEventSrc.incomePerLevel) {
//     randomEvent.incomePerLevel = randomEventSrc.incomePerLevel.map(
//       (incomePerLevel) => ({
//         level: incomePerLevel.level,
//         resources: incomePerLevel.resources.map((resource) => ({
//           type: getTerm(`Common/Resource/${resource.type}`, locale),
//           amount: resource.amount,
//         })),
//         troopIncomes: incomePerLevel.troopIncomes.map((troopIncome) => {
//           const unit = getUnit(
//             troopIncome.factionKey,
//             troopIncome.unitKey,
//             locale
//           )!;
//           const upgrade =
//             unit[
//               troopIncome.upgradeType as
//                 | "vanilla"
//                 | "upgraded"
//                 | "superUpgraded"
//             ]!;

//           return {
//             factionKey: troopIncome.factionKey,
//             unitKey: troopIncome.unitKey,
//             name: upgrade.name,
//             description: upgrade.description,
//             size: troopIncome.size,
//           };
//         }),
//       })
//     );
//   }

//   if (randomEventSrc.stacks) {
//     randomEvent.stacks = randomEventSrc.stacks.map((stack) => ({
//       name: getTerm(stack.nameKey, locale),
//       description: stack.descriptionKey
//         ? getTerm(stack.descriptionKey, locale)
//         : "",
//       icon: stack.icon,
//       research: stack.research.map((research) => ({
//         id: research.id,
//         name: research.nameKey ? getTerm(research.nameKey, locale) : "",
//         description: research.descriptionKey
//           ? getTerm(research.descriptionKey, locale)
//           : "",
//         costEntries: research.costEntries.map((costEntry) => ({
//           type: getTerm(`Common/Resource/${costEntry.type}`, locale),
//           amount: costEntry.amount,
//         })),
//         bacterias: research.bacterias.map((bacteria) =>
//           getLocaleBacteria(bacteria, locale)
//         ),
//       })),
//     }));
//   }
// return randomEvent;

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
  isReocurring: boolean;
  chanceOfHappening: number;
  eventEvaluationTrigger: string;
  requirementEvaluationType: string;
  requirements: object;
  eventRecipient: string;
  reward: object;
  penalty: object;
};
