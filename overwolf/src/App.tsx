import { AppShell, ScrollArea, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import Savegame from "../../components/Savegame/Savegame";
import { deserializeSavegame, SavegameDeserialized } from "../../lib/savegames";
import Mantine from "../../components/Mantine/Mantine";
import AppHeader from "./components/AppHeader/AppHeader";
import AppAside from "./components/AppAside/AppAside";
import AvailableSavegames from "./components/AvailableSavegames/AvailableSavegames";
import Ads from "./components/Ads/Ads";
import { readFile } from "./utils/io";

function App() {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const savegame = useMemo<SavegameDeserialized | null>(
    () => (fileContent ? deserializeSavegame(fileContent) : null),
    [fileContent]
  );

  console.log(savegame);

  return (
    <Mantine>
      <AppShell
        header={<AppHeader />}
        fixed
        aside={
          <AppAside>
            <AvailableSavegames
              onFileClick={(file) => {
                readFile(file.path).then(setFileContent);
              }}
            />
            <Ads />
          </AppAside>
        }
        styles={(theme) => ({
          root: {
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            userSelect: "none",
          },
          main: {
            backgroundColor: theme.colors.dark[8],
            display: "grid",
            overflow: "hidden",
            height:
              "calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))",
          },
        })}
      >
        <ScrollArea>
          {savegame && <Savegame savegame={savegame} />}
          {!savegame && <Text color="dimmed">Please select a savegame</Text>}
        </ScrollArea>
      </AppShell>
    </Mantine>
  );
}

export default App;
