/** Constants to handle town graph rendering. */

import { THEME_CONSTANTS } from "../../components/Mantine/Mantine";

// The width of the largest component (currently from the Rana faction).
export const MAX_COMPONENT_WIDTH = 5;
// How large each building node and sprite are.
export const NODE_SIZE = 64;
// How much space to leave between horizontally adjacent nodes.
export const NODE_MARGIN_RIGHT = 32;
// How much space to leave between vertically adjacent nodes.
export const NODE_MARGIN_BOTTOM = 64;

// Town graph rendering colors.
export const TOWN_GRAPH_COLORS = {
  selectionPrimary: THEME_CONSTANTS.colors.brand[4],
  selectionSecondary: THEME_CONSTANTS.colors.brand[5],
  selectionNeutral: "#c1c2c5",
  backgroundDark: "#1a1b1e",
};
