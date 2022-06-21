import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Stack, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import Head from "next/head";
import { getTerm, TermsDTO } from "../../lib/terms";
import { ArtifactDTO, getArtifact, getArtifacts } from "../../lib/artifacts";
import { Fragment } from "react";
import { useTerms } from "../../components/Terms/Terms";

const Unit: NextPage<{ artifact: ArtifactDTO }> = ({ artifact }) => {
  const terms = useTerms();
  return (
    <>
      <Head>
        <title>{artifact.name} - SoC.gg</title>
        <meta
          name="description"
          content={`${artifact.name} unit details of Songs of Conquest`}
        />
      </Head>
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
