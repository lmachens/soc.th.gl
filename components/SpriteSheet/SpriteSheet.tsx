type SpriteSheetProps = {
  spriteSheet: {
    name: string;
    spriteSheet: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
};
const SpriteSheet = ({ spriteSheet }: SpriteSheetProps) => {
  return (
    <div
      style={{
        backgroundImage: `url(/${spriteSheet.spriteSheet})`,
        backgroundPosition: `left -${spriteSheet.x}px bottom -${spriteSheet.y}px`,
        height: spriteSheet.height,
        width: spriteSheet.width,
      }}
    />
  );
};

export default SpriteSheet;
