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
    term: "The Hidden Gaming Lair",
    links: [
      {
        term: "TH.GL",
        title: "Interactive maps & overlays for 20+ games",
        href: "https://th.gl/",
        target: "_blank",
      },
      {
        term: "Discord",
        title: "Join the community",
        href: "https://th.gl/discord",
        target: "_blank",
      },
      {
        term: "GitHub",
        title: "Open source projects",
        href: "https://github.com/The-Hidden-Gaming-Lair",
        target: "_blank",
      },
      {
        term: "Reddit",
        title: "r/TheHiddenGamingLair",
        href: "https://www.reddit.com/r/TheHiddenGamingLair/",
        target: "_blank",
      },
    ],
  },
];

export default footerLinks;
