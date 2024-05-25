import { Group, Table, Text } from "@mantine/core";
import { Fragment } from "react";
import { SkillPoolDTO } from "../../lib/wielders";
import SpriteSheet from "../SpriteSheet/SpriteSheet";
import { useTerms } from "../Terms/Terms";
import SkillPopover from "./SkillPopover";

type Props = {
  skillPools: SkillPoolDTO[];
};
const SkillPoolsTable = ({ skillPools }: Props) => {
  const terms = useTerms();

  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>
            {terms.requiredSkills} ({terms.level})
          </th>
          <th>Wielder level</th>
        </tr>
      </thead>
      <tbody>
        {skillPools.map((skillPool) => (
          <Fragment key={skillPool.name}>
            {skillPool.skills.map((skill, index) => (
              <tr key={`${skillPool.name}-${skill.type}-${index}`}>
                <td>
                  <SkillPopover skill={skill}>
                    <Group spacing={2} sx={{ minWidth: 160 }}>
                      <SpriteSheet
                        folder="skills"
                        spriteSheet={skill.icon}
                        inline
                        resize={0.3}
                      />
                      {skill.name}
                    </Group>
                  </SkillPopover>
                </td>
                <td>
                  <Group>
                    {skill.requiresSkill &&
                      skill.requiredSkills.map((requiredSkill, index) => (
                        <Fragment key={`${skill.type}-${requiredSkill.type}`}>
                          {index !== 0 && (
                            <Text
                              component="span"
                              mr="sm"
                              color="dimmed"
                              transform="uppercase"
                              size="xs"
                            >
                              {skill.requirementType === "RequireAll"
                                ? terms.and
                                : terms.or}
                            </Text>
                          )}
                          <SkillPopover skill={requiredSkill}>
                            <Group spacing={2}>
                              <SpriteSheet
                                folder="skills"
                                spriteSheet={requiredSkill.icon}
                                inline
                                resize={0.3}
                              />
                              <Text component="span" mx="xs">
                                {requiredSkill.name} ({requiredSkill.level})
                              </Text>
                            </Group>
                          </SkillPopover>
                        </Fragment>
                      ))}
                  </Group>
                </td>
                <td>
                  {skillPool.evaluationType === "LevelRange" &&
                    `${skillPool.levelRange.min}-${skillPool.levelRange.max}`}
                  {skillPool.evaluationType === "LevelInterval" &&
                    `${skillPool.levelIntervalStartLevel}, ${
                      skillPool.levelIntervalStartLevel +
                      skillPool.levelInterval
                    }, ${
                      skillPool.levelIntervalStartLevel +
                      skillPool.levelInterval * 2
                    }, ...`}
                </td>
              </tr>
            ))}
          </Fragment>
        ))}
      </tbody>
    </Table>
  );
};

export default SkillPoolsTable;
