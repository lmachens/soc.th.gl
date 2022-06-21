import { AppProps } from "next/app";
import Head from "next/head";
import { Global, MantineProvider } from "@mantine/core";
import AppLayout from "../components/AppLayout/AppLayout";
import { ReactNode, useEffect } from "react";
import { initPlausible } from "../lib/stats";
import { NextPage } from "next";

export type NextPageWithBanner<T = {}> = NextPage<T> & {
  getBanner?: () => ReactNode;
};

type AppPropsWithBanner = AppProps & {
  Component: NextPageWithBanner;
};

export default function App(props: AppPropsWithBanner) {
  const { Component, pageProps } = props;

  useEffect(() => {
    initPlausible();
  }, []);

  return (
    <>
      <Head>
        <title>SoC.gg</title>
        <meta name="description" content="Songs of Conquest Fansite" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
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
      </MantineProvider>
    </>
  );
}
