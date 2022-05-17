import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getWielder, getWielders, WielderDTO } from "../../lib/wielders";

const Wielder: NextPage<{ wielder: WielderDTO }> = ({ wielder }) => {
  return (
    <Stack>
      <Title order={4}>{wielder.name}</Title>
      <SpriteSheet spriteSheet={wielder.portrait} />
      <Text size="sm">{wielder.description}</Text>
    </Stack>
  );
};

export default Wielder;

export const getStaticProps = withStaticBase(async (context) => {
  const type = context.params!.type as string;
  const wielder = getWielder(type, context.locale!);
  if (!wielder) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      wielder,
    },
    revalidate: false,
  };
});

export const getStaticPaths: GetStaticPaths = async () => {
  const wielders = getWielders("en").map((wielder) => ({
    params: {
      type: wielder.type,
    },
  }));

  return {
    paths: wielders,
    fallback: "blocking",
  };
};
