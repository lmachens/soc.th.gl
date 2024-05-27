import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Group, SimpleGrid, Text } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getUnits, UnitSimpleDTO } from "../../lib/units";
import Article from "../../components/Article/Article";
import PageHead from "../../components/PageHead/PageHead";
import { useTerms } from "../../components/Terms/Terms";
import { TermsDTO, getTerm } from "../../lib/terms";

const Units: NextPage<{ units: UnitSimpleDTO[] }> = ({ units }) => {
  const terms = useTerms();

  return (
    <>
      <PageHead
        title="Units - SoC.th.gl"
        description="All units of Songs of Conquest"
      />
      <SimpleGrid
        breakpoints={[
          { minWidth: "sm", cols: 1 },
          { minWidth: "md", cols: 2 },
          { minWidth: "lg", cols: 3 },
        ]}
      >
        {units.map((unit) => (
          <Article
            key={unit.vanilla.languageKey}
            image={
              <SpriteSheet spriteSheet={unit.vanilla.sprite} folder="units" />
            }
            name={unit.vanilla.name}
            href={`/units/${unit.faction}/${unit.vanilla.languageKey}`}
          >
            <Group>
              <Text color="dimmed" size="sm">
                {terms.damage}{" "}
                <Text
                  component="span"
                  size="sm"
                  sx={(theme) => ({
                    color: theme.colors.gray[3],
                  })}
                >
                  {unit.vanilla.stats.damage.min}-
                  {unit.vanilla.stats.damage.max}
                </Text>
              </Text>
              <Text color="dimmed" size="sm">
                {terms.health}{" "}
                <Text
                  component="span"
                  size="sm"
                  sx={(theme) => ({
                    color: theme.colors.gray[3],
                  })}
                >
                  {unit.vanilla.stats.health}
                </Text>
              </Text>
              <Text color="dimmed" size="sm">
                {terms.movement}{" "}
                <Text
                  component="span"
                  size="sm"
                  sx={(theme) => ({
                    color: theme.colors.gray[3],
                  })}
                >
                  {unit.vanilla.stats.movement}
                </Text>
              </Text>
            </Group>
          </Article>
        ))}
      </SimpleGrid>
    </>
  );
};

export default Units;

export const getStaticProps = withStaticBase(async (context) => {
  const units = getUnits(context.locale!);
  const locale = context.locale! as string;

  const terms: TermsDTO = {
    movement: getTerm("Commanders/Details/CommanderStat/Movement", locale),
    damage: getTerm("Units/Tooltip/Damage", locale),
    health: getTerm("Units/Tooltip/Health", locale),
  };

  return {
    props: {
      units,
      terms,
    },
    revalidate: false,
  };
});
