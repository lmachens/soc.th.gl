import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";
import { Stack } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getWielders, WielderSimpleDTO } from "../../lib/wielders";
import Head from "next/head";
import Article from "../../components/Article/Article";

const Wielders: NextPage<{ wielders: WielderSimpleDTO[] }> = ({ wielders }) => {
  return (
    <>
      <Head>
        <title>Wielders - SoC.gg</title>
        <meta name="description" content="All wielders of Songs of Conquest" />
      </Head>
      <Stack>
        {wielders.map((wielder) => (
          <Article
            key={wielder.type}
            image={
              <SpriteSheet
                spriteSheet={wielder.portrait}
                folder="wielders"
                resize={0.5}
              />
            }
            name={wielder.name}
            description={wielder.description}
            href={`/wielders/${wielder.type}`}
          />
        ))}
      </Stack>
    </>
  );
};

export default Wielders;

export const getStaticProps = withStaticBase(async (context) => {
  const wielders = getWielders(context.locale!);

  return {
    props: {
      wielders,
    },
    revalidate: false,
  };
});
