const locales = require("./lib/collections/locale.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: locales
      .filter((locale) => locale.code)
      // Disable swedish translations, because it's only used as placeholders
      .filter((locale) => locale.code !== "sv")
      .map((locale) => locale.code),
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/factions",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
