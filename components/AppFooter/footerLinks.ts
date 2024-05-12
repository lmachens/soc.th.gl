const footerLinks: {
  term: string;
  links: {
    term: string;
    href: string;
    target?: string;
    title?: string;
  }[];
}[] = [
  {
    term: "About",
    links: [
      {
        term: "SoC.th.gl Discord",
        href: "https://th.gl/discord",
        target: "_blank",
      },
      {
        term: "Sitemap",
        href: "/sitemap.xml",
        target: "_blank",
      },
      {
        term: "PrivacyPolicy",
        href: "/privacy",
      },
    ],
  },
  {
    term: "OfficalLinks",
    links: [
      {
        term: "Official Discord",
        href: "http://discord.gg/soc",
        target: "_blank",
      },
      {
        term: "SongsOfConquest",
        href: "https://www.songsofconquest.com/",
        target: "_blank",
      },
    ],
  },
  {
    term: "BuyOn",
    links: [
      {
        term: "Steam",
        href: "https://store.steampowered.com/app/867210/Songs_of_Conquest/?utm_source=Landing_page",
        target: "_blank",
      },
      {
        term: "GoG",
        href: "https://www.gog.com/game/songs_of_conquest",
        target: "_blank",
      },
      {
        term: "EpicGames",
        href: "https://www.epicgames.com/store/p/songs-of-conquest",
        target: "_blank",
      },
    ],
  },
  {
    term: "More projects",
    links: [
      {
        term: "The Hidden Gaming Lair",
        title: "Gaming apps and tools",
        href: "https://www.th.gl/",
        target: "_blank",
      },
      {
        term: "New World Map",
        title: "Interactive map for New World",
        href: "https://aeternum-map.th.gl/",
        target: "_blank",
      },
      {
        term: "Lost Ark",
        title: "Interactive map for Lost Ark",
        href: "https://arkesia.th.gl/",
        target: "_blank",
      },
      {
        term: "Sons Of The Forest Map",
        title: "Interactive Map for Sons Of The Forest",
        href: "https://sotf.th.gl/",
        target: "_blank",
      },
      {
        term: "Hogwarts Legacy",
        title: "Hogwarts Legacy Fansite",
        href: "https://hogwarts.th.gl/",
        target: "_blank",
      },
      {
        term: "League of Legends",
        title: "Trophies app for League of Legends",
        href: "https://lol.th.gl/",
        target: "_blank",
      },
      {
        term: "Window Overlays",
        title: "Simply display any website as customizable Overlay",
        href: "https://github.com/lmachens/skeleton",
        target: "_blank",
      },
    ],
  },
];

export default footerLinks;
