import Cookies from "js-cookie";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactNode, useEffect } from "react";
import AnchorAd from "../components/Ads/AnchorAd";
import AppLayout from "../components/AppLayout/AppLayout";
import Mantine from "../components/Mantine/Mantine";
import PageHead from "../components/PageHead/PageHead";
import { TermsProvider } from "../components/Terms/Terms";
import { loadNitroAds } from "../lib/nitroAds";
import { initPlausible } from "../lib/stats";
import { useAccountStore } from "../lib/store/account";

export type NextPageWithBanner<T = {}> = NextPage<T> & {
  getBanner?: () => ReactNode;
};

type AppPropsWithBanner = AppProps & {
  Component: NextPageWithBanner;
};

const App = ({ Component, pageProps }: AppPropsWithBanner) => {
  const accountStore = useAccountStore();

  useEffect(() => {
    let userId = Cookies.get("userId");
    const refreshState = async () => {
      if (!userId) {
        const state = useAccountStore.getState();
        if (state.isPatron) {
          accountStore.setIsPatron(false);
        }
        return;
      }

      const response = await fetch(
        `https://www.th.gl/api/patreon?appId=jjeemjmkdjlmookbecggoebemjieoihjhhkfmmbl`,
        { credentials: "include" }
      );
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
    };
    refreshState();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const newUserId = Cookies.get("userId");
        if (newUserId !== userId) {
          userId = newUserId;
          refreshState();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    initPlausible("soc.th.gl", "https://metrics.th.gl");
    if (!accountStore.isPatron) {
      loadNitroAds();
    }
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
