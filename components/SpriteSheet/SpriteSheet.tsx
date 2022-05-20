type SpriteSheetProps = {
  className?: string;
  folder?: string;
  spriteSheet: {
    name: string;
    spriteSheet: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
};
const SpriteSheet = ({
  className,
  folder = "",
  spriteSheet,
}: SpriteSheetProps) => {
  return (
    <div
      style={{
        backgroundImage: `url(/${folder ? `${folder}/` : ""}${
          spriteSheet.spriteSheet
        })`,
        backgroundPosition: `left -${spriteSheet.x}px bottom -${spriteSheet.y}px`,
        height: spriteSheet.height,
        width: spriteSheet.width,
      }}
      className={className}
    />
  );
};

export default SpriteSheet;
