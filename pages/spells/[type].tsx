import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Stack, Table, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getTerm, TermsDTO } from "../../lib/terms";
import { useTerms } from "../../components/Terms/Terms";
import { getSpell, getSpells, SpellDTO } from "../../lib/spells";
import { Fragment } from "react";
import PopoverLink from "../../components/PopoverLink/PopoverLink";
import PageHead from "../../components/PageHead/PageHead";

const Unit: NextPage<{ spell: SpellDTO }> = ({ spell }) => {
  const terms = useTerms();
  return (
    <>
      <PageHead
        title={`${spell.name} - SoC.gg`}
        description={`${spell.description} - ${spell.name} (Songs of Conquest)`}
      />
      <Stack>
        <Title order={4}>{spell.name}</Title>
        <SpriteSheet spriteSheet={spell.icon} folder="spells" />
        <Text size="sm" sx={{ fontStyle: "italic" }}>
          {spell.description}
        </Text>
        <Table>
          <tbody>
            <tr>
              <td>
                <Text
                  sx={(theme) => ({
                    color: theme.colors[theme.primaryColor][5],
                  })}
                >
                  {terms.spellCostHeader}
                </Text>
              </td>
            </tr>
            <tr>
              <td>
                {spell.costs
                  .map((cost) => `${cost.type} x${cost.amount}`)
                  .join(", ")}
              </td>
            </tr>
            {spell.tiers.map((tier) => (
              <Fragment key={tier.tier}>
                <tr>
                  <td>
                    <Text
                      sx={(theme) => ({
                        color: theme.colors[theme.primaryColor][5],
                      })}
                    >
                      {terms.tier} {tier.tier}
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td>
                    {tier.bacterias.map((bacteria, index) => (
                      <div key={index}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: bacteria.description,
                          }}
                        />
                        {bacteria.duration && (
                          <>
                            <Text
                              sx={(theme) => ({
                                color: theme.colors[theme.primaryColor][5],
                              })}
                              component="span"
                            >
                              {terms.duration}:
                            </Text>
                            <Text component="span" mx="xs">
                              {bacteria.duration}
                            </Text>
                          </>
                        )}
                      </div>
                    ))}

                    {tier.requiredCommanderSkills.length > 0 && (
                      <div>
                        <Text
                          sx={(theme) => ({
                            color: theme.colors[theme.primaryColor][5],
                          })}
                          component="span"
                        >
                          {terms.requiredSkills}:
                        </Text>
                        {tier.requiredCommanderSkills.map((requiredSkill) => (
                          <PopoverLink
                            key={requiredSkill.type}
                            href={`/skills/${requiredSkill.type}`}
                            popover={
                              <Stack>
                                <Title order={4}>{requiredSkill.name}</Title>
                                <Text size="sm">{requiredSkill.lore}</Text>
                              </Stack>
                            }
                          >
                            <Text component="span" mx="xs">
                              {requiredSkill.name} {requiredSkill.level}
                            </Text>
                          </PopoverLink>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </Table>
      </Stack>
    </>
  );
};

export default Unit;

export const getStaticProps = withStaticBase(async (context) => {
  const locale = context.locale!;
  const type = context.params!.type as string;
  const spell = getSpell(type, locale);
  if (!spell) {
    return {
      notFound: true,
    };
  }

  const terms: TermsDTO = {
    spellCostHeader: getTerm("Spells/Spellbook/SpellCostHeader", locale),
    tier: getTerm(
      "Adventure/TroopManagementMenu/DefendingTowerLevelDesc",
      locale
    ),
    requiredSkills: getTerm(
      "Tutorial/Codex/Spells/RequiredSkillMultiple",
      locale
    ),
    duration: getTerm("Bacterias/Tooltip/Duration/Duration", locale),
  };

  return {
    props: {
      spell,
      terms,
    },
    revalidate: false,
  };
});

export const getStaticPaths: GetStaticPaths = async () => {
  const spells = getSpells("en").map((spell) => ({
    params: {
      type: spell.type,
    },
  }));

  return {
    paths: spells,
    fallback: "blocking",
  };
};
