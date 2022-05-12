/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: [
      "en",
      "sv",
      "ru",
      "cs",
      "fr",
      "de",
      "it",
      "pl",
      "es",
      "zh-CN",
      "ja",
      "ko",
      "pt-BR",
      "uk",
    ],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en",
  },
};

module.exports = nextConfig;
