import { Stack, Tabs } from "@mantine/core";
import { SavegameDeserialized } from "../../lib/savegames";
import SavegameGraphs from "./SavegameGraphs";
import SavegameMeta from "./SavegameMeta";
import SavegameProgress from "./SavegameProgress";
import SavegameTeams from "./SavegameTeams";
import SavegameWielders from "./SavegameWielders";

type Props = {
  savegame: SavegameDeserialized;
};
const Savegame = ({ savegame }: Props) => {
  return (
    <Stack>
      <SavegameMeta savegame={savegame} />
      <Tabs defaultValue="wielders">
        <Tabs.List grow pb="xs">
          <Tabs.Tab value="wielders">Wielders</Tabs.Tab>
          <Tabs.Tab value="teams">Teams</Tabs.Tab>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="graphs">Graphs</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="wielders">
          <SavegameWielders savegame={savegame} />
        </Tabs.Panel>
        <Tabs.Panel value="teams">
          <SavegameTeams savegame={savegame} />
        </Tabs.Panel>
        <Tabs.Panel value="overview">
          <SavegameProgress savegame={savegame} />
        </Tabs.Panel>
        <Tabs.Panel value="graphs">
          <SavegameGraphs savegame={savegame} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default Savegame;
