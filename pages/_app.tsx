import { AppProps } from "next/app";
import Head from "next/head";
import { AppShell, MantineProvider } from "@mantine/core";
import AppHeader from "../components/AppHeader";
import { TermsContext } from "../lib/terms";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <TermsContext.Provider value={props.pageProps.termsMap}>
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
        <AppShell header={<AppHeader />}>
          <Component {...pageProps} />
        </AppShell>
      </MantineProvider>
    </TermsContext.Provider>
  );
}
