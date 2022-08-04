import { getGameIsRunning, SONGS_OF_CONQUEST_CLASS_ID } from "./utils/games";
import { SHOW_HIDE_HOTKEY } from "./utils/hotkeys";
import {
  closeMainWindow,
  closeWindow,
  getPreferedWindowName,
  restoreWindow,
  toggleWindow,
} from "./utils/windows";

async function init() {
  overwolf.extensions.onAppLaunchTriggered.addListener(openApp);

  overwolf.settings.hotkeys.onPressed.addListener(async (event) => {
    if (event.name === SHOW_HIDE_HOTKEY) {
      const preferedWindowName = await getPreferedWindowName();
      toggleWindow(preferedWindowName);
    }
  });

  overwolf.games.onGameInfoUpdated.addListener(async (event) => {
    if (
      event.runningChanged &&
      event.gameInfo?.classId === SONGS_OF_CONQUEST_CLASS_ID
    ) {
      const preferedWindowName = await getPreferedWindowName();
      if (event.gameInfo.isRunning) {
        if (preferedWindowName === "overlay") {
          restoreWindow("overlay");
          closeWindow("desktop");
        } else {
          restoreWindow("desktop");
          closeWindow("overlay");
        }
      } else {
        closeMainWindow();
      }
    }
  });

  openApp();
}

async function openApp() {
  const isGameRunning = await getGameIsRunning(SONGS_OF_CONQUEST_CLASS_ID);
  if (isGameRunning) {
    const preferedWindowName = await getPreferedWindowName();
    restoreWindow(preferedWindowName);
  } else {
    restoreWindow("desktop");
  }
}

init();

export {};
