import { Group, NumberInput, Stack, Title } from "@mantine/core";
import { SavegameDeserialized } from "../../lib/savegames";
type Props = {
  savegame: SavegameDeserialized;
};
const SavegameWielders = ({ savegame }: Props) => {
  const wielders = savegame.File._commandersSerializable.filter(
    (commander) => commander._reference.Name !== "Ghost"
  );
  return (
    <>
      {wielders.map((wielder) => (
        <Stack key={wielder._id}>
          <Title order={4}>
            {wielder._reference.Name} (
            {
              savegame.File._teamsSerializable.find(
                (team) => team._teamID === wielder._teamId
              )?._name
            }
            )
          </Title>
          <Group>
            <NumberInput
              defaultValue={wielder._stats._movement}
              label="Movement"
            />
          </Group>
        </Stack>
      ))}
    </>
  );
};

export default SavegameWielders;
