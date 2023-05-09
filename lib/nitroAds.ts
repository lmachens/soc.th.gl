type NitroAds = {
  // eslint-disable-next-line no-unused-vars
  createAd: (id: string, options: any) => void;
  addUserToken: () => void;
  queue: [string, any][];
};

interface MyWindow extends Window {
  nitroAds?: NitroAds;
}
declare var window: MyWindow;

export let nitroAds: NitroAds;

if (typeof window !== "undefined") {
  window.nitroAds = window.nitroAds || {
    createAd: function () {
      window.nitroAds?.queue?.push(["createAd", arguments]);
    },
    addUserToken: function () {
      window.nitroAds?.queue?.push(["addUserToken", arguments]);
    },
    queue: [],
  };
  nitroAds = window.nitroAds;
}

export const loadNitroAds = () => {
  const script = document.createElement("script");
  script.src = "https://s.nitropay.com/ads-1487.js";
  script.setAttribute("data-cfasync", "false");
  script.async = true;

  document.body.appendChild(script);
};
