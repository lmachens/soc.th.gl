import { Stack, Text, Title } from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";
import { withStaticBase } from "../lib/staticProps";

const Home: NextPage<{}> = () => {
  return (
    <>
      <Head>
        <title>SoC.gg</title>
        <meta name="description" content="Songs of Conquest Fansite" />
      </Head>
      <Stack>
        <Title order={2}>Welcome Adventurer!</Title>
        <Text>This site is under construction.</Text>
        <Text>
          But you can already find factions, skills, wielders and units here.
        </Text>
      </Stack>
    </>
  );
};

export default Home;

export const getStaticProps = withStaticBase(async () => {
  return {
    props: {},
    revalidate: false,
  };
});
