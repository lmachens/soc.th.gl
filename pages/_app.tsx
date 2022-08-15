import { AppProps } from "next/app";
import AppLayout from "../components/AppLayout/AppLayout";
import { ReactNode, useEffect } from "react";
import { initPlausible } from "../lib/stats";
import { NextPage } from "next";
import { TermsProvider } from "../components/Terms/Terms";
import { loadNitroAds } from "../lib/nitroAds";
import AnchorAd from "../components/Ads/AnchorAd";
import PageHead from "../components/PageHead/PageHead";
import Mantine from "../components/Mantine/Mantine";

export type NextPageWithBanner<T = {}> = NextPage<T> & {
  getBanner?: () => ReactNode;
};

type AppPropsWithBanner = AppProps & {
  Component: NextPageWithBanner;
};

const App = ({ Component, pageProps }: AppPropsWithBanner) => {
  useEffect(() => {
    if (
      typeof process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN === "string" &&
      typeof process.env.NEXT_PUBLIC_PLAUSIBLE_HOST === "string"
    ) {
      initPlausible(
        process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
        process.env.NEXT_PUBLIC_PLAUSIBLE_HOST
      );
    }
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
      <Mantine>
        <AppLayout
          collectionLinks={pageProps.collectionLinks}
          banner={Component.getBanner?.()}
        >
          <Component {...pageProps} />
        </AppLayout>
        <AnchorAd />
      </Mantine>
    </>
  );
};

const AppWithTerms = (props: AppPropsWithBanner) => (
  <TermsProvider terms={props.pageProps.terms}>
    <App {...props} />
  </TermsProvider>
);

export default AppWithTerms;
