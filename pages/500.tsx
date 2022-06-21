import { Text } from "@mantine/core";
import { NextPage } from "next";
import { withStaticBase } from "../lib/staticProps";

const ErrorPage: NextPage<{}> = () => {
  return <Text>An error occurred on client</Text>;
};
export default ErrorPage;

export const getStaticProps = withStaticBase(async () => {
  return {
    props: {
      terms: {},
    },
    revalidate: false,
  };
});
