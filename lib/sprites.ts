export type SpriteDTO = {
  name: string;
  spriteSheet: string;
  x: number;
  y: number;
  width: number;
  height: number;
  outline?: { x: number; y: number }[][];
};
