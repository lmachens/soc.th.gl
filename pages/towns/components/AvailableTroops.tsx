import { Box, Grid, Stack, Text } from "@mantine/core";
import React from "react";
import SpriteSheet from "../../../components/SpriteSheet/SpriteSheet";
import { UnitSimpleDTO, UnitTypeDTO } from "../../../lib/units";


const UnitTypeBox: React.FC<{
  unit: UnitTypeDTO | null,
}> = ({ unit }) => {
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
}> = ({
  unit,
}) => {
  return (
    <Stack>
      <UnitTypeBox unit={unit.vanilla as UnitTypeDTO} />
      {unit.upgraded && (
        <UnitTypeBox unit={unit.upgraded as UnitTypeDTO} />
      )}
      {unit.superUpgraded && (
        <UnitTypeBox unit={unit.superUpgraded as UnitTypeDTO} />
      )}
    </Stack>
  );
};

export const AvailableTroops: React.FC<{
  units: UnitSimpleDTO[];
}> = ({
  units
}) => {
  return (
    <Grid columns={units.length}>
      {(units || []).map((unit) => (
        <Grid.Col
          span={1}
          key={`${unit.vanilla.name}-stack`}
        >
          <UnitStack
            unit={unit}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};
