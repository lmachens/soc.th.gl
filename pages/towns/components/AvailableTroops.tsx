import { Box, Grid, Stack, Text, Tooltip } from "@mantine/core";
import React from "react";
import SpriteSheet from "../../../components/SpriteSheet/SpriteSheet";
import { UnitSimpleDTO, UnitTypeDTO } from "../../../lib/units";
import { useStoreFromContext } from "./TownGraphStoreProvider";
import { useShallow } from "zustand/react/shallow";
import { TownGraphState } from "../store";
import { kTownGraphColors } from "../constants";
import AppLink from "../../../components/AppLink/AppLink";


const kEssenceTypeToColor: { [key: string] : string } = {
  "order": "#303dc5",
  "chaos": "#cd3cd9",
  "destruction": "#d74034",
  "creation": "#f2df33",
  "arcana": "#00c6b2",
};


const UnitTypeBox: React.FC<{
  unit: UnitTypeDTO | null,
  available: boolean,
  buildingKey: string,
  toggleDwellingSelection: (key: string) => void,
  href: string,
}> = ({
  unit,
  available,
  buildingKey,
  toggleDwellingSelection,
  href,
}) => {
  if (!unit) {
    return null;
  }
  const maxOffense = Math.max(
    unit.stats.meleeAttack.offense, unit.stats.rangedAttack.offense);

  const essenceList: string[] = [];
  Object.entries(unit.stats.essenceStats).forEach(
    ([essenceType, essenceValue]) => {
      if (essenceValue > 0) {
        Array.from({ length: essenceValue }).forEach((_) => {
          essenceList.push(essenceType);
        });
      }
    }
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "110px 1fr",
        alignItems: "center",
        justifyItems: "center",
        position: "relative",
      }}
    >
      <span
        onClick={() => toggleDwellingSelection(buildingKey)}
        style={{
          cursor: "pointer",
        }}
      >
        <span
          style={{
            filter: available ? 'none' : 'grayscale(0.9)',
          }}
        >
          <SpriteSheet
            spriteSheet={unit.sprite}
            folder="units"
          />
        </span>
        {
          essenceList.map((essenceType, essenceIndex) => (
            <Text
              key={`${unit.languageKey}-${essenceType}-${essenceIndex}`}
              style={{
                position: "absolute",
                top: 10 * essenceIndex,
                right: 0,
                color: kEssenceTypeToColor[essenceType],
                opacity: available ? '100%' : '40%',
              }}
              size={8}
            >
              ⬤
            </Text>
          ))
        }
      </span>
      <Text
        size="xs"
        sx={{
          whiteSpace: "nowrap",
        }}
      >
        <AppLink
          href={href}
          style={{
            color: available ? kTownGraphColors.selectionPrimary : 'inherit'
          }}
        >
          {unit.name}
        </AppLink>
      </Text>
      <Text
          component="span"
          size={10}
          sx={{
            color: available ? kTownGraphColors.selectionSecondary : 'inherit'
          }}
        >
          <Tooltip label="damage">
            <span>⚔ {unit.stats.damage.min}–{unit.stats.damage.max}</span>
          </Tooltip>
          &nbsp;
          <Tooltip label="offense">
            <span>({maxOffense})</span>
          </Tooltip>
      </Text>
      <Text
          component="span"
          size={10}
          sx={{
            color: available ? kTownGraphColors.selectionSecondary : 'inherit'
          }}
        >
        <Tooltip label="health">
          <span>♥ {unit.stats.health}</span>
        </Tooltip>
        &nbsp;
        <Tooltip label="defense">
          <span>({unit.stats.defense})</span>
        </Tooltip>
      </Text>
    </Box>
  );
}

const UnitStack: React.FC<{
  unit: UnitSimpleDTO,
  availableTroopKeys: Set<string>,
  unitKeyToBuildingKey: { [key: string]: string },
  toggleNodeSelection: (key: string) => void,
}> = ({
  unit,
  availableTroopKeys,
  unitKeyToBuildingKey,
  toggleNodeSelection,
}) => {
  // All unit levels in a stack come from the same building.
  const href = `/units/${unit.faction}/${unit.vanilla.languageKey}`;
  return (
    <Stack>
      <UnitTypeBox
        unit={unit.vanilla as UnitTypeDTO}
        available={availableTroopKeys.has(unit.vanilla.languageKey)}
        buildingKey={unitKeyToBuildingKey[unit.vanilla.languageKey]}
        toggleDwellingSelection={toggleNodeSelection}
        href={href}
      />
      {unit.upgraded && (
        <UnitTypeBox
          unit={unit.upgraded as UnitTypeDTO}
          available={availableTroopKeys.has(unit.upgraded.languageKey)}
          buildingKey={unitKeyToBuildingKey[unit.upgraded.languageKey]}
          toggleDwellingSelection={toggleNodeSelection}
          href={href}
        />
      )}
      {unit.superUpgraded && (
        <UnitTypeBox
          unit={unit.superUpgraded as UnitTypeDTO}
          available={availableTroopKeys.has(unit.superUpgraded.languageKey)}
          buildingKey={unitKeyToBuildingKey[unit.superUpgraded.languageKey]}
          toggleDwellingSelection={toggleNodeSelection}
          href={href}
        />
      )}
    </Stack>
  );
};

const selector = (state: TownGraphState) => ({
  availableTroopKeys: state.availableTroopKeys,
  toggleNodeSelection: state.toggleNodeSelection,
});

const AvailableTroops: React.FC<{
  units: UnitSimpleDTO[];
  unitKeyToBuildingKey: { [key: string]: string };
}> = ({
  units,
  unitKeyToBuildingKey,
}) => {
  const {
    availableTroopKeys,
    toggleNodeSelection,
 } = useStoreFromContext(useShallow(selector));
  return (
    <Grid columns={units.length}>
      {(units).map((unit) => (
        <Grid.Col
          md={2}
          lg={1}
          key={`${unit.vanilla.name}-stack`}
        >
          <UnitStack
            unit={unit}
            availableTroopKeys={availableTroopKeys}
            unitKeyToBuildingKey={unitKeyToBuildingKey}
            toggleNodeSelection={toggleNodeSelection}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default AvailableTroops;
