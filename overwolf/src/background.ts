import { initPlausible } from "../../lib/stats";
import { getGameIsRunning, SONGS_OF_CONQUEST_CLASS_ID } from "./utils/games";
import { SHOW_HIDE_HOTKEY } from "./utils/hotkeys";
import { useAccountStore } from "./utils/store/account";
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

async function openApp(event?: overwolf.extensions.AppLaunchTriggeredEvent) {
  let userId = useAccountStore.getState().userId;
  if (event?.origin === "urlscheme") {
    const matchedUserId = decodeURIComponent(event.parameter).match(
      "userId=([^&]*)"
    );
    const newUserId = matchedUserId ? matchedUserId[1] : null;
    if (newUserId) {
      userId = newUserId;
    }
  }
  if (userId) {
    const accountStore = useAccountStore.getState();
    const response = await fetch(`https://www.th.gl/api/patreon/overwolf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appId: "jjeemjmkdjlmookbecggoebemjieoihjhhkfmmbl",
        userId,
      }),
    });
    try {
      const body = await response.json();
      if (!response.ok) {
        console.warn(body);
        accountStore.setIsPatron(false);
      } else {
        console.log(`Patreon successfully activated`);
        accountStore.setIsPatron(true, userId);
      }
    } catch (err) {
      console.error(err);
      accountStore.setIsPatron(false);
    }
  }

  const isGameRunning = await getGameIsRunning(SONGS_OF_CONQUEST_CLASS_ID);
  if (isGameRunning) {
    const preferedWindowName = await getPreferedWindowName();
    restoreWindow(preferedWindowName);
  } else {
    restoreWindow("desktop");
  }
}

init();

initPlausible("soc.gg-app", "https://metrics.th.gl");
