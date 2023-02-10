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
        term: "SoC.gg Discord",
        href: "https://discord.com/invite/NTZu8Px",
        target: "_blank",
      },
      {
        term: "GitHub",
        href: "https://github.com/lmachens/soc.gg",
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
        term: "Hogwarts.gg",
        title: "Hogwarts Legacy Fansite",
        href: "https://www.hogwarts.gg/",
        target: "_blank",
      },
      {
        term: "Aeternum Map",
        title: "Interactive map for New World",
        href: "https://aeternum-map.gg/",
        target: "_blank",
      },
      {
        term: "Arkesia.gg",
        title: "Interactive map for Lost Ark",
        href: "https://www.arkesia.gg/",
        target: "_blank",
      },
      {
        term: "Trophy Hunter",
        title: "Trophies app for League of Legends",
        href: "https://th.gl/",
        target: "_blank",
      },
      {
        term: "Skeleton",
        title: "Simply display any website as customizable Overlay",
        href: "https://github.com/lmachens/skeleton",
        target: "_blank",
      },
    ],
  },
];

export default footerLinks;
