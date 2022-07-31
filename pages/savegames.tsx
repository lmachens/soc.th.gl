import { ActionIcon, Group, Stack, Text, TextInput } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { CopyIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import {
  deserializeSavegame,
  SavegameDeserialized,
  serializeSavegame,
} from "../lib/savegames";
import { withStaticBase } from "../lib/staticProps";
import { useClipboard } from "@mantine/hooks";
import Savegame from "../components/Savegame/Savegame";

const Savegames = () => {
  const [file, setFile] = useState<File | null>(null);
  const [savegame, setSavegame] = useState<SavegameDeserialized | null>(null);
  const clipboard = useClipboard({ timeout: 500 });

  useEffect(() => {
    if (file) {
      file.text().then(deserializeSavegame).then(setSavegame);
    }
  }, [file]);

  if (savegame) {
    console.log(serializeSavegame(savegame));
  }

  return (
    <>
      <Stack>
        <Text>
          This tool is in development and analyzes your Songs of Conquest
          savegames.
        </Text>
        <TextInput
          label="Windows savegames path (paste in your Windows Explorer)"
          value="%appdata%\..\LocalLow\Lavapotion\SongsOfConquest\Savegames"
          disabled
          styles={{
            input: {
              ":disabled": {
                cursor: "text",
              },
            },
          }}
          rightSection={
            <ActionIcon
              onClick={() =>
                clipboard.copy(
                  "%appdata%\\..\\LocalLow\\Lavapotion\\SongsOfConquest\\Savegames"
                )
              }
            >
              <CopyIcon />
            </ActionIcon>
          }
        />
        <Dropzone
          onDrop={(files) => setFile(files[0])}
          onReject={() => setFile(null)}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <Text size="xl">Drag savegame here or click to select file</Text>
          </Group>
        </Dropzone>
        {savegame && <Savegame savegame={savegame} />}
      </Stack>
    </>
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
