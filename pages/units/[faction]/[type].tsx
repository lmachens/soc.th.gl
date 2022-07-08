import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../../lib/staticProps";

import { Stack, Table, Text, Title } from "@mantine/core";
import SpriteSheet from "../../../components/SpriteSheet/SpriteSheet";
import { getUnit, getUnits, UnitDTO, UnitTypeDTO } from "../../../lib/units";
import Head from "next/head";
import { getTerm, TermsDTO } from "../../../lib/terms";
import { BacteriaDTO } from "../../../lib/bacterias";
import { useTerms } from "../../../components/Terms/Terms";

const Unit: NextPage<{ unit: UnitDTO }> = ({ unit }) => {
  const terms = useTerms();
  const renderType = (unitType: UnitTypeDTO) => (
    <>
      <Stack>
        <Title order={4}>{unitType.name}</Title>
        <SpriteSheet spriteSheet={unitType.sprite} />
        <Text size="sm" sx={{ fontStyle: "italic" }}>
          {unitType.description}
        </Text>
      </Stack>
      <Table>
        <tbody>
          <tr>
            <td>{terms.maxTroopSize}</td>
            <td>{unitType.stats.maxTroopSize}</td>
          </tr>
          <tr>
            <td>{terms.damage}</td>
            <td>
              {unitType.stats.damage.min}-{unitType.stats.damage.max}
            </td>
          </tr>
          <tr>
            <td>{terms.health}</td>
            <td>{unitType.stats.health}</td>
          </tr>
          <tr>
            <td>{terms.meleeOffence}</td>
            <td>{unitType.stats.meleeAttack.offense}</td>
          </tr>
          <tr>
            <td>{terms.defense}</td>
            <td>{unitType.stats.defense}</td>
          </tr>
          <tr>
            <td>{terms.movement}</td>
            <td>{unitType.stats.movement}</td>
          </tr>
          <tr>
            <td>{terms.initiative}</td>
            <td>{unitType.stats.initiative}</td>
          </tr>
          <tr>
            <td>{terms.status}</td>
            <td>{unitType.stats.statuses?.join(", ")}</td>
          </tr>
          <tr>
            <td>{terms.cost}</td>
            <td>{unitType.purchaseCost.costEntries.map(value => {
              let res=value.amount.toString()
              switch (value.type) {
                case 0:
                    res+=" Gold";
                    break;
                case 3:
                    res+=" Ancient Ember";
                    break;
                case 4:
                    res+=" Glimmerweave";
                    break;
                case 5:
                    res+=" Celestial Ore";
                    break;
                default:
                    res+=""
                    break;
              }
              return res
            }).join(", ")}</td>
          </tr>
          {unitType.troopAbility && (
            <tr>
              <td>{unitType.troopAbility.name}</td>
              <td>
                {unitType.troopAbility.description && (
                  <div>{unitType.troopAbility.description}</div>
                )}
                {unitType.troopAbility.bacterias.map((bacteria) => (
                  <div
                    key={bacteria.bacteriaType}
                    dangerouslySetInnerHTML={sanitizeBacteriaData(bacteria)}
                  />
                ))}
              </td>
            </tr>
          )}
          {unitType.bacterias.map((bacteria) => (
            <tr key={bacteria.bacteriaType}>
              <td>{bacteria.name}</td>
              <td>
                <div>{bacteria.description}</div>
                <div dangerouslySetInnerHTML={sanitizeBacteriaData(bacteria)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  return (
    <>
      <Head>
        <title>{unit.vanilla.name} - SoC.gg</title>
        <meta
          name="description"
          content={`${unit.vanilla.name} unit details of Songs of Conquest`}
        />
      </Head>
      <Stack>
        {renderType(unit.vanilla)}
        {unit.upgraded && renderType(unit.upgraded)}
        {unit.superUpgraded && renderType(unit.superUpgraded)}
      </Stack>
    </>
  );
};

export default Unit;

export const getStaticProps = withStaticBase(async (context) => {
  const locale = context.locale!;
  const faction = context.params!.faction as string;
  const type = context.params!.type as string;
  const unit = getUnit(faction, type, locale);
  if (!unit) {
    return {
      notFound: true,
    };
  }

  const terms: TermsDTO = {
    cost: getTerm("Common/Resource/Cost", locale),
    maxTroopSize: getTerm("Units/Tooltip/MaxTroopSize", locale),
    damage: getTerm("Units/Tooltip/Damage", locale),
    health: getTerm("Units/Tooltip/Health", locale),
    meleeOffence: getTerm("Units/Tooltip/MeleeOffense", locale),
    defense: getTerm("Units/Tooltip/Defense", locale),
    movement: getTerm("Units/Tooltip/Movement", locale),
    initiative: getTerm("Units/Tooltip/Initiative", locale),
    status: getTerm("Units/Tooltip/Status", locale),
  };

  return {
    props: {
      unit,
      terms,
    },
    revalidate: false,
  };
});

const sanitizeBacteriaData = (bacteria: BacteriaDTO) => {
  return {
    __html: bacteria.modifierData
      .map((modifier) => modifier.description)
      .join("<br />"),
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const units = getUnits("en").map((unit) => ({
    params: {
      faction: unit.faction,
      type: unit.vanilla.languageKey,
    },
  }));

  return {
    paths: units,
    fallback: "blocking",
  };
};
