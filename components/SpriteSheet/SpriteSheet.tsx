import { CSSProperties } from "react";
import { SpriteDTO } from "../../lib/sprites";

const getClipPath = (spriteSheet: SpriteDTO) => {
  if (!spriteSheet.outline) {
    return "initial";
  }
  const paths =
    spriteSheet.outline.reduce(
      (path, outline) =>
        path +
        outline.reduce(
          (prev, position) =>
            prev +
            `${spriteSheet.width / 2 + position.x},${
              spriteSheet.height / 2 - position.y
            } `,
          "M"
        ),
      "path('"
    ) + "Z')";
  return paths;
};
type SpriteSheetProps = {
  className?: string;
  folder?: string;
  spriteSheet: SpriteDTO;
  resize?: number;
  inline?: boolean;
};
const SpriteSheet = ({
  className,
  folder = "",
  spriteSheet,
  resize,
  inline,
}: SpriteSheetProps) => {
  const style: CSSProperties = {
    backgroundImage: `url(/${folder ? `${folder}/` : ""}${
      spriteSheet.spriteSheet
    })`,
    backgroundPosition: `left -${spriteSheet.x}px bottom -${spriteSheet.y}px`,
    height: spriteSheet.height,
    width: spriteSheet.width,
    margin: "0 auto",
    clipPath: getClipPath(spriteSheet),
    display: inline ? "inline-block" : "block",
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
          marginLeft: inline ? 0 : `${percentage}%`,
          display: inline ? "inline-block" : "block",
        }}
      >
        <div style={style} className={className} />
      </div>
    );
  }

  return <div style={style} className={className} />;
};

export default SpriteSheet;
