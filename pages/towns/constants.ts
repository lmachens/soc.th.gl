/** Constants to handle town graph rendering. */

import { kThemeConstants } from "../../components/Mantine/Mantine";

// The width of the largest component (currently from the Rana faction).
export const kMaxComponentWidth = 5;
// How large each building node and sprite are.
export const kNodeSize = 64;
// How much space to leave between horizontally adjacent nodes.
export const kNodeMarginRight = 32;
// How much space to leave between vertically adjacent nodes.
export const kNodeMarginBottom = 64;

// Town graph rendering colors.
export const kTownGraphColors = {
  selectionPrimary: kThemeConstants.colors.brand[4],
  selectionSecondary: kThemeConstants.colors.brand[5],
  selectionNeutral: '#c1c2c5',
  backgroundDark: '#1a1b1e',
};
