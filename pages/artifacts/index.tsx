import { NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { SimpleGrid, Text } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import Article from "../../components/Article/Article";
import { ArtifactSimpleDTO, getArtifacts } from "../../lib/artifacts";
import PageHead from "../../components/PageHead/PageHead";
import { Fragment } from "react";
import { TermsDTO, getTerm } from "../../lib/terms";
import { useTerms } from "../../components/Terms/Terms";

const Skills: NextPage<{ artifacts: ArtifactSimpleDTO[] }> = ({
  artifacts,
}) => {
  const terms = useTerms();

  return (
    <>
      <PageHead
        title="Artifacts - SoC.th.gl"
        description="All artifacts of Songs of Conquest"
      />
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
            href={`/artifacts/${artifact.type}`}
          >
            {artifact.bacterias.map((bacteria) => (
              <Fragment key={bacteria.bacteriaType}>
                {bacteria.modifierData.map((modifier) => (
                  <Text
                    key={modifier.type}
                    dangerouslySetInnerHTML={{
                      __html: modifier.description,
                    }}
                  />
                ))}
                {bacteria.resourcesIncome.map((resourceIncome) => (
                  <Text key={resourceIncome.type}>
                    {`${terms.production} +${resourceIncome.amount} ${resourceIncome.name}`}
                  </Text>
                ))}
              </Fragment>
            ))}
          </Article>
        ))}
      </SimpleGrid>
    </>
  );
};

export default Skills;

export const getStaticProps = withStaticBase(async (context) => {
  const artifacts = getArtifacts(context.locale!);
  const locale = context.locale!;

  const terms: TermsDTO = {
    production: getTerm("Common/Details/GeneratesResources", locale),
  };

  return {
    props: {
      artifacts,
      terms,
    },
    revalidate: false,
  };
});
