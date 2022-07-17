import { AppProps } from "next/app";
import { Global, MantineProvider } from "@mantine/core";
import AppLayout from "../components/AppLayout/AppLayout";
import { ReactNode, useEffect } from "react";
import { initPlausible } from "../lib/stats";
import { NextPage } from "next";
import { TermsProvider } from "../components/Terms/Terms";
import { loadNitroAds } from "../lib/nitroAds";
import AnchorAd from "../components/Ads/AnchorAd";
import PageHead from "../components/PageHead/PageHead";

export type NextPageWithBanner<T = {}> = NextPage<T> & {
  getBanner?: () => ReactNode;
};

type AppPropsWithBanner = AppProps & {
  Component: NextPageWithBanner;
};

const App = ({ Component, pageProps }: AppPropsWithBanner) => {
  useEffect(() => {
    initPlausible();
    loadNitroAds();
  }, []);

  return (
    <>
      <PageHead
        title="Songs of Conquest database and wiki for building, factions, units, skills, spells and wielders - SoC.gg"
        description="SoC.gg contains all the information about building, factions, units, skills, spells, wielders and more for the turn-based strategy game Songs of Conquest."
      >
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </PageHead>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
          fontFamily: '"Roboto", sans-serif',
          colors: {
            brand: [
              "#fef4e7",
              "#fbddb6",
              "#f8c786",
              "#f6b156",
              "#f39a25",
              "#da810c",
              "#a96409",
              "#794707",
              "#492b04",
              "#180e01",
            ],
          },
          primaryColor: "brand",
          headings: { fontFamily: '"Averia Serif Libre", cursive' },
        }}
        styles={{
          Title: (theme) => ({
            root: {
              color: theme.colors[theme.primaryColor][4],
            },
          }),
        }}
      >
        <Global
          styles={() => ({
            ".highlight": {
              color: "#f28f0d",
            },
            ".positive": {
              color: "#177c13",
            },
            ".negative": {
              color: "#c51b1b",
            },
          })}
        />
        <AppLayout
          collectionLinks={pageProps.collectionLinks}
          banner={Component.getBanner?.()}
        >
          <Component {...pageProps} />
        </AppLayout>
        <AnchorAd />
      </MantineProvider>
    </>
  );
};

const AppWithTerms = (props: AppPropsWithBanner) => (
  <TermsProvider terms={props.pageProps.terms}>
    <App {...props} />
  </TermsProvider>
);

export default AppWithTerms;
