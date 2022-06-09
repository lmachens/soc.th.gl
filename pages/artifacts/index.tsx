import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { SimpleGrid } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import Head from "next/head";
import Article from "../../components/Article/Article";
import { ArtifactSimpleDTO, getArtifacts } from "../../lib/artifacts";

const Skills: NextPage<{ artifacts: ArtifactSimpleDTO[] }> = ({
  artifacts,
}) => {
  return (
    <>
      <Head>
        <title>Artifacts - SoC.gg</title>
        <meta name="description" content="All artifacts of Songs of Conquest" />
      </Head>
      <SimpleGrid
        breakpoints={[
          { minWidth: "sm", cols: 1 },
          { minWidth: "md", cols: 2 },
          { minWidth: "lg", cols: 3 },
        ]}
      >
        {artifacts.map((artifact) => (
          <Article
            key={artifact.type}
            image={
              <SpriteSheet spriteSheet={artifact.icon} folder="artifacts" />
            }
            name={artifact.name}
            description={artifact.description}
            href={`/artifacts/${artifact.type}`}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default Skills;

export const getStaticProps = withStaticBase(async (context) => {
  const artifacts = getArtifacts(context.locale!);

  return {
    props: {
      artifacts,
    },
    revalidate: false,
  };
});
