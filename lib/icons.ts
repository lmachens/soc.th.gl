import iconsCollection from "./collections/icons.json";
import { SpriteDTO } from "./sprites";

export const getIcon = (name: string) => {
  return iconsCollection.find((icon) => icon.name === name);
};

export const getWielderStatsIcons = () => {
  return {
    StatsOffenceRendered: getIcon("StatsOffenceRendered"),
    StatsDefenseRendered: getIcon("StatsDefenseRendered"),
    StatsMovementRendered: getIcon("StatsMovementRendered"),
    StatsViewRendered: getIcon("StatsViewRendered"),
  };
};

export type IconsDTO = {
  [name: string]: SpriteDTO;
};
