import { Stack } from "@mantine/core";
import { SavegameDeserialized } from "../../lib/savegames";
import MetaLine from "../MetaLine/MetaLine";

type Props = {
  savegame: SavegameDeserialized;
};
const SavegameMeta = ({ savegame }: Props) => {
  return (
    <Stack spacing="xs">
      <MetaLine
        label="Campaign Identifier"
        value={savegame.Metadata.CampaignIdentifier}
      />
      <MetaLine label="Game Mode" value={savegame.Metadata.GameMode} />
      <MetaLine label="Map Name" value={savegame.Metadata.MapName} />
      <MetaLine label="Players" value={savegame.Metadata.Players} />
      <MetaLine label="Round" value={savegame.Metadata.Round} />
      <MetaLine label="Save Version" value={savegame.Metadata.SaveVersion} />
    </Stack>
  );
};

export default SavegameMeta;
