import { Stack, Text, Title } from "@mantine/core";
import { ReactNode } from "react";
import { SkillSimpleDTO } from "../../lib/skills";
import PopoverLink from "../PopoverLink/PopoverLink";
import SpriteSheet from "../SpriteSheet/SpriteSheet";

type Props = {
  skill: SkillSimpleDTO;
  children: ReactNode;
};
const SkillPopover = ({ skill, children }: Props) => {
  return (
    <PopoverLink
      href={`/skills/${skill.type}`}
      popover={
        <Stack>
          <SpriteSheet folder="skills" spriteSheet={skill.icon} />
          <Title order={4}>{skill.name}</Title>
          <Text size="sm">{skill.lore}</Text>
        </Stack>
      }
    >
      {children}
    </PopoverLink>
  );
};

export default SkillPopover;
