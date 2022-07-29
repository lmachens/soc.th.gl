import { useEffect, useState } from "react";
import Lore from "../../components/Lore/Lore";
import Savegame from "../../components/Savegame/Savegame";
import { deserializeSavegame, SavegameDeserialized } from "../../lib/savegames";
import { readFile } from "./utils";
const FILE_PATH = `${overwolf.io.paths.localAppData}\\..\\LocalLow\\Lavapotion\\SongsOfConquest\\Savegames\\Quicksaves\\QuickSave_4.sav`;

function App() {
  const [savegame, setSavegame] = useState<SavegameDeserialized | null>(null);

  useEffect(() => {
    readFile(FILE_PATH).then(deserializeSavegame).then(setSavegame);
  }, []);

  console.log(savegame);

  return (
    <div className="App">
      <Lore text="Test" />
      {savegame && <Savegame savegame={savegame} />}
    </div>
  );
}

export default App;
