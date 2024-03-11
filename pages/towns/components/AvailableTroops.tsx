import { Box, Grid, Stack, Text, Tooltip } from "@mantine/core";
import React from "react";
import SpriteSheet from "../../../components/SpriteSheet/SpriteSheet";
import { UnitSimpleDTO, UnitTypeDTO } from "../../../lib/units";
import { useStoreFromContext } from "./TownGraphStoreProvider";
import { useShallow } from "zustand/react/shallow";
import { TownGraphState } from "../store";


const UnitTypeBox: React.FC<{
  unit: UnitTypeDTO | null,
  available: boolean,
  buildingKey: string,
  toggleDwellingSelection: (key: string) => void,
}> = ({
  unit,
  available,
  buildingKey,
  toggleDwellingSelection,
}) => {
  if (!unit) {
    return null;
  }
  console.log(unit);
  const maxOffense = Math.max(
    unit.stats.meleeAttack.offense, unit.stats.rangedAttack.offense);
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "110px 1fr",
        alignItems: "center",
        justifyItems: "center",
        ...available ? {} : {
          filter: 'grayscale(1)'
        },
      }}
    >
      <span
        onClick={() => toggleDwellingSelection(buildingKey)}
        style={{
          cursor: "pointer",
        }}
      >
        <SpriteSheet
          spriteSheet={unit.sprite}
          folder="units"
        />
      </span>
      <Text
        size="xs"
        sx={(theme) => ({
          whiteSpace: "nowrap",
          color: available ? theme.colors[theme.primaryColor][5] : 'inherit'
        })}
      >
        {unit.name}
      </Text>
      <Text
          component="span"
          size={10}
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
        >
        <Tooltip label="health (defense)">
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

  return (
    <Stack>
      <UnitTypeBox
        unit={unit.vanilla as UnitTypeDTO}
        available={availableTroopKeys.has(unit.vanilla.languageKey)}
        buildingKey={unitKeyToBuildingKey[unit.vanilla.languageKey]}
        toggleDwellingSelection={toggleNodeSelection}
      />
      {unit.upgraded && (
        <UnitTypeBox
          unit={unit.upgraded as UnitTypeDTO}
          available={availableTroopKeys.has(unit.upgraded.languageKey)}
          buildingKey={unitKeyToBuildingKey[unit.upgraded.languageKey]}
          toggleDwellingSelection={toggleNodeSelection}
        />
      )}
      {unit.superUpgraded && (
        <UnitTypeBox
          unit={unit.superUpgraded as UnitTypeDTO}
          available={availableTroopKeys.has(unit.superUpgraded.languageKey)}
          buildingKey={unitKeyToBuildingKey[unit.superUpgraded.languageKey]}
          toggleDwellingSelection={toggleNodeSelection}
        />
      )}
    </Stack>
  );
};

const selector = (state: TownGraphState) => ({
  availableTroopKeys: state.availableTroopKeys,
  toggleNodeSelection: state.toggleNodeSelection,
});

export const AvailableTroops: React.FC<{
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
