import { Box, Grid, Stack, Text, Tooltip } from "@mantine/core";
import React from "react";
import { UnitSimpleDTO, UnitTypeDTO } from "../../lib/units";
import { useStoreFromContext } from "./TownGraphStoreProvider";
import { useShallow } from "zustand/react/shallow";
import { TownGraphState } from "./store";
import AppLink from "../AppLink/AppLink";
import SpriteSheet from "../SpriteSheet/SpriteSheet";
import { TOWN_GRAPH_COLORS } from "../../lib/towns/constants";

const ESSENCE_TYPE_TO_COLOR: { [key: string]: string } = {
  order: "#303dc5",
  chaos: "#cd3cd9",
  destruction: "#d74034",
  creation: "#f2df33",
  arcana: "#00c6b2",
};

const SYMBIOSIS_PREFIX = "TraitRootsSpongeAura";

const getSymbiosisEssences = (
  bacterias?: { type: string }[]
): string[] => {
  if (!bacterias) return [];
  return bacterias
    .filter((b) => b.type.startsWith(SYMBIOSIS_PREFIX))
    .map((b) => b.type.slice(SYMBIOSIS_PREFIX.length).toLowerCase());
};

const UnitTypeBox: React.FC<{
  unit: UnitTypeDTO | null;
  available: boolean;
  buildingKey: string;
  requiredResearch: number[];
  toggleDwellingSelection: (key: string) => void;
  toggleResearchSelection: (nodeId: string, researchId: number) => void;
  selectedResearchIds: Set<number>;
  href: string;
  bacterias?: { type: string }[];
}> = ({
  unit,
  available,
  buildingKey,
  requiredResearch,
  toggleDwellingSelection,
  toggleResearchSelection,
  selectedResearchIds,
  href,
  bacterias,
}) => {
  if (!unit) {
    return null;
  }
  const maxOffense = Math.max(
    unit.stats.meleeAttack.offense,
    unit.stats.rangedAttack.offense
  );

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

  const symbiosisEssences = getSymbiosisEssences(bacterias);

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
        onClick={() => {
          const hasResearch = requiredResearch.length > 0;
          if (hasResearch) {
            const anyUnselected = requiredResearch.some(
              (id) => !selectedResearchIds.has(id)
            );
            if (anyUnselected) {
              requiredResearch.forEach((id) => {
                if (!selectedResearchIds.has(id)) {
                  toggleResearchSelection(buildingKey, id);
                }
              });
            } else {
              toggleDwellingSelection(buildingKey);
            }
          } else {
            toggleDwellingSelection(buildingKey);
          }
        }}
        style={{
          cursor: "pointer",
        }}
      >
        <span
          style={{
            filter: available ? "none" : "grayscale(0.9)",
          }}
        >
          <SpriteSheet spriteSheet={unit.sprite} folder="units" />
        </span>
        {essenceList.map((essenceType, essenceIndex) => (
          <Text
            key={`${unit.languageKey}-${essenceType}-${essenceIndex}`}
            style={{
              position: "absolute",
              top: 10 * essenceIndex,
              right: 0,
              color: ESSENCE_TYPE_TO_COLOR[essenceType],
              opacity: available ? "100%" : "40%",
            }}
            size={8}
          >
            ⬤
          </Text>
        ))}
        {symbiosisEssences.map((essenceType, essenceIndex) => (
          <Tooltip
            key={`${unit.languageKey}-symbiosis-${essenceType}-${essenceIndex}`}
            label="Symbiosis"
          >
            <Text
              style={{
                position: "absolute",
                top: 10 * essenceList.length + 4 + 8 * essenceIndex,
                right: 1,
                color: ESSENCE_TYPE_TO_COLOR[essenceType],
                opacity: available ? "100%" : "40%",
              }}
              size={6}
            >
              ⬤
            </Text>
          </Tooltip>
        ))}
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
            color: available ? TOWN_GRAPH_COLORS.selectionPrimary : "inherit",
          }}
        >
          {unit.name}
        </AppLink>
      </Text>
      <Text
        component="span"
        size={10}
        sx={{
          color: available ? TOWN_GRAPH_COLORS.selectionSecondary : "inherit",
        }}
      >
        <Tooltip label="damage">
          <span>
            ⚔ {unit.stats.damage.min}–{unit.stats.damage.max}
          </span>
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
          color: available ? TOWN_GRAPH_COLORS.selectionSecondary : "inherit",
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
};

const UnitStack: React.FC<{
  unit: UnitSimpleDTO;
  availableTroopKeys: Set<string>;
  unitKeyToBuildingKey: { [key: string]: string };
  unitKeyToRequiredResearch: { [key: string]: number[] };
  toggleNodeSelection: (key: string) => void;
  toggleResearchSelection: (nodeId: string, researchId: number) => void;
  selectedResearchIds: Set<number>;
}> = ({
  unit,
  availableTroopKeys,
  unitKeyToBuildingKey,
  unitKeyToRequiredResearch,
  toggleNodeSelection,
  toggleResearchSelection,
  selectedResearchIds,
}) => {
  // All unit levels in a stack come from the same building.
  const href = `/units/${unit.faction}/${unit.vanilla.languageKey}`;
  return (
    <Stack>
      <UnitTypeBox
        unit={unit.vanilla as UnitTypeDTO}
        available={availableTroopKeys.has(unit.vanilla.languageKey)}
        buildingKey={unitKeyToBuildingKey[unit.vanilla.languageKey]}
        requiredResearch={unitKeyToRequiredResearch[unit.vanilla.languageKey] || []}
        toggleDwellingSelection={toggleNodeSelection}
        toggleResearchSelection={toggleResearchSelection}
        selectedResearchIds={selectedResearchIds}
        href={href}
        bacterias={(unit.vanilla as any).bacterias}
      />
      {unit.upgraded && (
        <UnitTypeBox
          unit={unit.upgraded as UnitTypeDTO}
          available={availableTroopKeys.has(unit.upgraded.languageKey)}
          buildingKey={unitKeyToBuildingKey[unit.upgraded.languageKey]}
          requiredResearch={unitKeyToRequiredResearch[unit.upgraded.languageKey] || []}
          toggleDwellingSelection={toggleNodeSelection}
          toggleResearchSelection={toggleResearchSelection}
          selectedResearchIds={selectedResearchIds}
          href={href}
          bacterias={(unit.upgraded as any).bacterias}
        />
      )}
      {unit.superUpgraded && (
        <UnitTypeBox
          unit={unit.superUpgraded as UnitTypeDTO}
          available={availableTroopKeys.has(unit.superUpgraded.languageKey)}
          buildingKey={unitKeyToBuildingKey[unit.superUpgraded.languageKey]}
          requiredResearch={unitKeyToRequiredResearch[unit.superUpgraded.languageKey] || []}
          toggleDwellingSelection={toggleNodeSelection}
          toggleResearchSelection={toggleResearchSelection}
          selectedResearchIds={selectedResearchIds}
          href={href}
          bacterias={(unit.superUpgraded as any).bacterias}
        />
      )}
    </Stack>
  );
};

const selector = (state: TownGraphState) => ({
  availableTroopKeys: state.availableTroopKeys,
  toggleNodeSelection: state.toggleNodeSelection,
  toggleResearchSelection: state.toggleResearchSelection,
  selectedResearchIds: state.selectedResearchIds,
});

const AvailableTroops: React.FC<{
  units: UnitSimpleDTO[];
  unitKeyToBuildingKey: { [key: string]: string };
  unitKeyToRequiredResearch: { [key: string]: number[] };
}> = ({ units, unitKeyToBuildingKey, unitKeyToRequiredResearch }) => {
  const {
    availableTroopKeys,
    toggleNodeSelection,
    toggleResearchSelection,
    selectedResearchIds,
  } = useStoreFromContext(useShallow(selector));
  return (
    <Grid columns={units.length}>
      {units.map((unit) => (
        <Grid.Col md={2} lg={1} key={`${unit.vanilla.name}-stack`}>
          <UnitStack
            unit={unit}
            availableTroopKeys={availableTroopKeys}
            unitKeyToBuildingKey={unitKeyToBuildingKey}
            unitKeyToRequiredResearch={unitKeyToRequiredResearch}
            toggleNodeSelection={toggleNodeSelection}
            toggleResearchSelection={toggleResearchSelection}
            selectedResearchIds={selectedResearchIds}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default AvailableTroops;
