import { Box, Grid, Stack, Text } from "@mantine/core";
import React from "react";
import SpriteSheet from "../../../components/SpriteSheet/SpriteSheet";
import { UnitSimpleDTO, UnitTypeDTO } from "../../../lib/units";
import { useStoreFromContext } from "./TownGraphStoreProvider";
import { useShallow } from "zustand/react/shallow";
import { TownGraphState } from "../store";


const UnitTypeBox: React.FC<{
  unit: UnitTypeDTO | null,
  available: boolean,
}> = ({ unit, available }) => {
  if (!unit) {
    return null;
  }
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
      <SpriteSheet spriteSheet={unit.sprite} folder="units" />
      <Text size="xs" style={{ whiteSpace: "nowrap" }}>
        {unit.name}
      </Text>
      <Text
          sx={(theme) => ({
            color: theme.colors[theme.primaryColor][5],
          })}
          component="span"
          size="xs"
        >
          {`4/day`}
      </Text>
    </Box>
  );
}

const UnitStack: React.FC<{
  unit: UnitSimpleDTO,
  availableTroopKeys: Set<string>,
}> = ({
  unit,
  availableTroopKeys,
}) => {
  return (
    <Stack>
      <UnitTypeBox
        unit={unit.vanilla as UnitTypeDTO}
        available={availableTroopKeys.has(unit.vanilla.languageKey)}
      />
      {unit.upgraded && (
        <UnitTypeBox
          unit={unit.upgraded as UnitTypeDTO}
          available={availableTroopKeys.has(unit.upgraded.languageKey)}
        />
      )}
      {unit.superUpgraded && (
        <UnitTypeBox
          unit={unit.superUpgraded as UnitTypeDTO}
          available={availableTroopKeys.has(unit.superUpgraded.languageKey)}
        />
      )}
    </Stack>
  );
};

const selector = (state: TownGraphState) => ({
  availableTroopKeys: state.availableTroopKeys,
});

export const AvailableTroops: React.FC<{
  units: UnitSimpleDTO[];
}> = ({
  units
}) => {
  const { availableTroopKeys } = useStoreFromContext(useShallow(selector));
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
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};
