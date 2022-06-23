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
  images: {
    domains: ["purecatamphetamine.github.io"],
  },
  async redirects() {
    return [
      {
        source: "/ads.txt",
        destination: "https://api.nitropay.com/v1/ads-1110.txt",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
