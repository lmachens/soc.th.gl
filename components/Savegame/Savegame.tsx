import { Stack } from "@mantine/core";
import { SavegameDeserialized } from "../../lib/savegames";
import SavegameGraphs from "./SavegameGraphs";
import SavegameMeta from "./SavegameMeta";
import SavegameProgress from "./SavegameProgress";
import SavegameTeams from "./SavegameTeams";

type Props = {
  savegame: SavegameDeserialized;
};
const Savegame = ({ savegame }: Props) => {
  return (
    <Stack>
      <SavegameMeta savegame={savegame} />
      <SavegameTeams savegame={savegame} />
      <SavegameProgress savegame={savegame} />
      <SavegameGraphs savegame={savegame} />
    </Stack>
  );
};

export default Savegame;
