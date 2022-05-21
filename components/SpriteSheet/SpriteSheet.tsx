import { CSSProperties } from "react";

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
  resize?: number;
};
const SpriteSheet = ({
  className,
  folder = "",
  spriteSheet,
  resize,
}: SpriteSheetProps) => {
  const style: CSSProperties = {
    backgroundImage: `url(/${folder ? `${folder}/` : ""}${
      spriteSheet.spriteSheet
    })`,
    backgroundPosition: `left -${spriteSheet.x}px bottom -${spriteSheet.y}px`,
    height: spriteSheet.height,
    width: spriteSheet.width,
    margin: "0 auto",
  };
  if (resize) {
    const percentage = resize * 100;
    style.transform = `scale(${resize}) translateX(-${percentage}%)`;
    style.transformOrigin = "top left";
    style.position = "absolute";
    return (
      <div
        style={{
          position: "relative",
          height: spriteSheet.height * resize,
          width: spriteSheet.width * resize,
          marginLeft: `${percentage}%`,
        }}
      >
        <div style={style} className={className} />
      </div>
    );
  }

  return <div style={style} className={className} />;
};

export default SpriteSheet;
