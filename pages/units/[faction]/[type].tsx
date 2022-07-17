import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../../lib/staticProps";

import { Stack, Table, Title } from "@mantine/core";
import SpriteSheet from "../../../components/SpriteSheet/SpriteSheet";
import { getUnit, getUnits, UnitDTO, UnitTypeDTO } from "../../../lib/units";
import { getTerm, TermsDTO } from "../../../lib/terms";
import { BacteriaDTO } from "../../../lib/bacterias";
import { useTerms } from "../../../components/Terms/Terms";
import Lore from "../../../components/Lore/Lore";
import PageHead from "../../../components/PageHead/PageHead";

const Unit: NextPage<{ unit: UnitDTO }> = ({ unit }) => {
  const terms = useTerms();
  const renderType = (unitType: UnitTypeDTO) => (
    <>
      <Stack>
        <Title order={4}>{unitType.name}</Title>
        <SpriteSheet spriteSheet={unitType.sprite} />
        <Lore text={unitType.description} />
      </Stack>
      <Table>
        <tbody>
          <tr>
            <td>{terms.essenceIntro}</td>
            <td>
              {Object.entries(unitType.stats.essenceStats)
                .filter(([, count]) => count > 0)
                .map(([essence, count]) => `${terms[essence]} ${count}x`)
                .join(", ")}
            </td>
          </tr>
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
            <td>{terms.rangeOffence}</td>
            <td>{unitType.stats.rangedAttack.offense}</td>
          </tr>
          <tr>
            <td>{terms.deadlyRange}</td>
            <td>{unitType.stats.rangedAttack.deadlyRange}</td>
          </tr>
          <tr>
            <td>{terms.range}</td>
            <td>
              {unitType.stats.rangedAttack.range.min} -{" "}
              {unitType.stats.rangedAttack.range.max}
            </td>
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
            <td>
              {unitType.purchaseCost.costEntries
                .map((value) => `${value.amount} ${value.type}`)
                .join(", ")}
            </td>
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
      <PageHead
        title={`${unit.vanilla.name} - SoC.gg`}
        description={`${unit.vanilla.description} - ${unit.vanilla.name} (Songs of Conquest)`}
      />
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
    rangeOffence: getTerm("Units/Tooltip/RangedOffense", locale),
    deadlyRange: getTerm("Units/Tooltip/DeadlyRange", locale),
    range: getTerm("Units/Tooltip/Range", locale),
    defense: getTerm("Units/Tooltip/Defense", locale),
    movement: getTerm("Units/Tooltip/Movement", locale),
    initiative: getTerm("Units/Tooltip/Initiative", locale),
    status: getTerm("Units/Tooltip/Status", locale),
    essenceIntro: getTerm("Units/Types/EssenceIntro", locale),
    order: getTerm("Units/Types/Order", locale),
    creation: getTerm("Units/Types/Creation", locale),
    chaos: getTerm("Units/Types/Chaos", locale),
    arcana: getTerm("Units/Types/Arcana", locale),
    destruction: getTerm("Units/Types/Destruction", locale),
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
