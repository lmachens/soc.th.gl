import {
  ActionIcon,
  Group,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useClipboard } from "@mantine/hooks";
import { CopyIcon } from "@primer/octicons-react";
import { useCallback, useEffect, useState } from "react";
import Savegame from "../components/Savegame/Savegame";
import { deserializeSavegame, SavegameDeserialized } from "../lib/savegames";
import { withStaticBase } from "../lib/staticProps";

const savegamePaths = [
  [
    "Windows",
    "%appdata%\\..\\LocalLow\\Lavapotion\\SongsOfConquest\\Savegames",
  ],
  [
    "MacOS",
    "/Users/user_name/Library/Application Support/Lavapotion/SongsOfConquest/Savegames",
  ],
  [
    "Wine",
    "<wine_prefix>drive_c/users/<user>/AppData/LocalLow/Lavapotion/SongsOfConquest/Savegames",
  ],
  [
    "Proton",
    ".local/share/Steam/steamapps/compatdata/867210/pfx/drive_c/users/steamuser/AppData/LocalLow/Lavapotion/SongsOfConquest/Savegames",
  ],
];
const Savegames = () => {
  const [file, setFile] = useState<File | null>(null);
  const [savegame, setSavegame] = useState<SavegameDeserialized | null>(null);
  const clipboard = useClipboard({ timeout: 500 });

  const loadSavegame = useCallback(() => {
    if (file) {
      file
        .text()
        .then((fileContent) => deserializeSavegame(fileContent))
        .then(setSavegame);
    }
  }, [file]);

  useEffect(() => {
    loadSavegame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const downloadFile = (fileContent: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([fileContent], { type: "text/plain" })
    );
    a.download = file!.name;
    a.click();
  };

  return (
    <>
      <Stack>
        <Text color="dimmed">
          This Savegame analyzer and editor is in development
        </Text>
        <Title order={4}>Savegames paths</Title>
        <Tabs defaultValue="windows">
          <Tabs.List>
            {savegamePaths.map((savegamePath) => (
              <Tabs.Tab key={savegamePath[0]} value={savegamePath[0]}>
                {savegamePath[0]}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {savegamePaths.map((savegamePath) => (
            <Tabs.Panel key={savegamePath[0]} value={savegamePath[0]} pt="xs">
              <TextInput
                value={savegamePath[1]}
                disabled
                styles={{
                  input: {
                    ":disabled": {
                      cursor: "text",
                    },
                  },
                }}
                rightSection={
                  <ActionIcon onClick={() => clipboard.copy(savegamePath[1])}>
                    <CopyIcon />
                  </ActionIcon>
                }
              />
            </Tabs.Panel>
          ))}
        </Tabs>

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
        {savegame && (
          <Savegame
            savegame={savegame}
            onReload={loadSavegame}
            onSave={downloadFile}
          />
        )}
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
