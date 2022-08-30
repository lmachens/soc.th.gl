import randomEventsCollection from "./collections/randomEvents.json";
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
    name: getTerm(`randomEventSrcs/${randomEventSrc.uniqueName}`, locale),
    description: getTerm(randomEventSrc.descriptionKey, locale),
    factionName:
      randomEventSrc.faction === "Generic"
        ? "Generic"
        : getTerm(`Factions/${randomEventSrc.faction}/Name`, locale),
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
};
