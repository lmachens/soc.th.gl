import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../../lib/staticProps";

import { Group, Stack, Table, Text, Title } from "@mantine/core";
import SpriteSheet from "../../../components/SpriteSheet/SpriteSheet";
import Head from "next/head";
import { getTerm, TermsDTO } from "../../../lib/terms";
import { BuildingDTO, getBuilding, getBuildings } from "../../../lib/buildings";
import Lore from "../../../components/Lore/Lore";
import { useTerms } from "../../../components/Terms/Terms";

const Building: NextPage<{ building: BuildingDTO }> = ({ building }) => {
  const terms = useTerms();

  return (
    <>
      <Head>
        <title>{building.name} - SoC.gg</title>
        <meta
          name="description"
          content={`${building.description} - ${building.name} (Songs of Conquest)`}
        />
      </Head>
      <Text color="red">
        This page is under development and will display more details soon!
      </Text>
      <Stack align="flex-start">
        <Group>
          <SpriteSheet spriteSheet={building.portraits[0]} folder="buildings" />
          <Stack spacing="xs">
            <Title order={2}>{building.name}</Title>
            <Lore text={building.description} />
          </Stack>
        </Group>
        <Title order={2}>{terms.requirements}</Title>
        <Table>
          <tbody>
            <tr>
              <td>{terms.cost}</td>
              <td>
                {building.requirements.costEntries.map((costEntry) => (
                  <Text key={costEntry.type}>
                    {costEntry.amount} {costEntry.type}
                  </Text>
                ))}
              </td>
            </tr>
            <tr>
              <td>{terms.requiredBuildings}</td>
              <td>
                {building.requirements.requiredBuildings.map(
                  (requiredBuilding) => (
                    <Text key={requiredBuilding}>{requiredBuilding}</Text>
                  )
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Stack>
    </>
  );
};

export default Building;

export const getStaticProps = withStaticBase(async (context) => {
  const locale = context.locale!;
  const faction = context.params!.faction as string;
  const name = context.params!.name as string;
  const building = getBuilding(`${faction}/${name}`, locale);
  if (!building) {
    return {
      notFound: true,
    };
  }

  const terms: TermsDTO = {
    requirements: getTerm("Adventure/BuildMenu/Requirements", locale),
    requiredBuildings: getTerm("Units/Tooltip/BuildingsThatProduce", locale),
    cost: getTerm("Common/Resource/Cost", locale),
  };

  return {
    props: {
      building,
      terms,
    },
    revalidate: false,
  };
});

export const getStaticPaths: GetStaticPaths = async () => {
  const buildings = getBuildings("en").map((building) => {
    const [faction, name] = building.type.split("/");
    return {
      params: {
        faction,
        name,
      },
    };
  });

  return {
    paths: buildings,
    fallback: "blocking",
  };
};
