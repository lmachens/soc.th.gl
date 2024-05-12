import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getTerm, TermsDTO } from "../../lib/terms";
import { ArtifactDTO, getArtifact, getArtifacts } from "../../lib/artifacts";
import { Fragment } from "react";
import { useTerms } from "../../components/Terms/Terms";
import PageHead from "../../components/PageHead/PageHead";

const Unit: NextPage<{ artifact: ArtifactDTO }> = ({ artifact }) => {
  const terms = useTerms();
  return (
    <>
      <PageHead
        title={`${artifact.name} - SoC.th.gl`}
        description={`${artifact.description} - ${artifact.name} (Songs of Conquest)`}
      />
      <Stack>
        <Title order={4}>{artifact.name}</Title>
        <SpriteSheet spriteSheet={artifact.icon} folder="artifacts" />
        <Text size="sm" sx={{ fontStyle: "italic" }}>
          {artifact.description}
        </Text>
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
      </Stack>
    </>
  );
};

export default Unit;

export const getStaticProps = withStaticBase(async (context) => {
  const locale = context.locale!;
  const type = context.params!.type as string;
  const artifact = getArtifact(type, locale);
  if (!artifact) {
    return {
      notFound: true,
    };
  }

  const terms: TermsDTO = {
    production: getTerm("Common/Details/GeneratesResources", locale),
  };

  return {
    props: {
      artifact,
      terms,
    },
    revalidate: false,
  };
});

export const getStaticPaths: GetStaticPaths = async () => {
  const artifacts = getArtifacts("en").map((artifact) => ({
    params: {
      type: artifact.type,
    },
  }));

  return {
    paths: artifacts,
    fallback: "blocking",
  };
};
