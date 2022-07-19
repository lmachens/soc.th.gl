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
      {savegame.File._level._exploration.map((exploration) => (
        <div key={exploration._teamId}>
          {exploration._exploredTiles.filter((tile) => tile).length} of{" "}
          {exploration._exploredTiles.length} tiles explored
          <br />
        </div>
      ))}
      {savegame.File._teamsSerializable.map((team) => (
        <div key={team._teamID}>
          Name: {team._name}
          <br />
          {team._statistics._roundStatistics.map((roundStatistic) => (
            <div key={roundStatistic.Round}>
              Round: {roundStatistic.Round}
              <br />
              WonBattles: {roundStatistic.WonBattles}
            </div>
          ))}
        </div>
      ))}
    </Stack>
  );
};

export default Savegame;
