import { Group, NumberInput, Stack, Table, Title } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { AI_MODES, FACTIONS, SavegameDeserialized } from "../../lib/savegames";

const RESOURCE_TYPES = [
  "Gold",
  "Wood",
  "Stone",
  "AncientAmber",
  "Glimmerweave",
  "CelestialOre",
];

type Props = {
  savegame: SavegameDeserialized;
  form: UseFormReturnType<SavegameDeserialized>;
};
const SavegameTeams = ({ savegame, form }: Props) => {
  const rows = savegame.File._teamsSerializable.map((team) => {
    const exploration = savegame.File._level._exploration.find(
      (exploration) => exploration._teamId === team._teamID
    );

    return (
      <tr key={team._teamID}>
        <td>{team._name}</td>
        <td>{FACTIONS[team._factionIndex]}</td>
        <td>{AI_MODES[team._aiMode]}</td>
        <td>{team._isAlive ? "True" : "False"}</td>
        <td>
          {exploration?._exploredTiles.filter((tile) => tile).length ?? 0} /{" "}
          {exploration?._exploredTiles.length ?? 0}
        </td>
      </tr>
    );
  });

  return (
    <Stack spacing="xs">
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Faction</th>
            <th>AI Mode</th>
            <th>Is Alive</th>
            <th>Tiles explored</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      {savegame.File._teamsSerializable.map((team, index) => (
        <Stack key={team._teamID}>
          <Title order={4}>{team._name}</Title>
          <Group>
            {team._resources._resources.map((resource, resourceIndex) => (
              <NumberInput
                key={resource.Type}
                label={RESOURCE_TYPES[resource.Type]}
                {...form.getInputProps(
                  `File._teamsSerializable.${index}._resources._resources.${resourceIndex}._amount`
                )}
              />
            ))}
          </Group>
        </Stack>
      ))}
    </Stack>
  );
};

export default SavegameTeams;
