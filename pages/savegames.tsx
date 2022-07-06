import { Group, Stack, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import {
  deserializeSavegame,
  SavegameDeserialized,
  serializeSavegame,
} from "../lib/savegames";
import { withStaticBase } from "../lib/staticProps";

const Savegames = () => {
  const [file, setFile] = useState<File | null>(null);
  const [savegame, setSavegame] = useState<SavegameDeserialized | null>(null);

  console.log(savegame);
  if (savegame) {
    console.log(serializeSavegame(savegame));
  }
  useEffect(() => {
    if (file) {
      file.text().then(deserializeSavegame).then(setSavegame);
    }
  }, [file]);

  return (
    <Stack>
      <Dropzone
        onDrop={(files) => setFile(files[0])}
        onReject={() => setFile(null)}
        accept={[".sav"]}
      >
        {() => (
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <Text size="xl" inline>
              Drag savegame here or click to select file
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Savegames are in
              %appdata%\..\LocalLow\Lavapotion\SongsOfConquest\Savegames
            </Text>
          </Group>
        )}
      </Dropzone>
      {savegame && (
        <div>
          CampaignIdentifier: {savegame.Metadata.CampaignIdentifier}
          <br />
          GameMode: {savegame.Metadata.GameMode}
          <br />
          MapName: {savegame.Metadata.MapName}
          <br />
          Players: {savegame.Metadata.Players}
          <br />
          Round: {savegame.Metadata.Round}
          <br />
          SaveVersion: {savegame.Metadata.SaveVersion}
          <br />
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
        </div>
      )}
    </Stack>
  );
};

export default Savegames;

export const getStaticProps = withStaticBase(async () => {
  return {
    props: {
      terms: {},
    },
    revalidate: false,
  };
});
