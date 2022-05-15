import { Stack, Text } from "@mantine/core";
import { NextPage } from "next";
import { withStaticBase } from "../lib/staticProps";

const Home: NextPage<{}> = () => {
  return (
    <Stack>
      <Text>Welcome Adventurer!</Text>
      <Text>This site is under construction.</Text>
    </Stack>
  );
};

export default Home;

export const getStaticProps = withStaticBase(async () => {
  return {
    props: {},
    revalidate: false,
  };
});
