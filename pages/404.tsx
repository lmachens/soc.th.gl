import { Text } from "@mantine/core";
import { NextPage } from "next";
import { withStaticBase } from "../lib/staticProps";

const NotFoundPage: NextPage<{}> = () => {
  return <Text>404 - Page not found</Text>;
};
export default NotFoundPage;

export const getStaticProps = withStaticBase(async () => {
  return {
    props: {
      terms: {},
    },
    revalidate: false,
  };
});
