import { GetStaticPaths, NextPage } from "next";
import { withStaticBase } from "../../lib/staticProps";

import { Blockquote, Stack, Table, Text, Title } from "@mantine/core";
import SpriteSheet from "../../components/SpriteSheet/SpriteSheet";
import { getWielder, getWielders, WielderDTO } from "../../lib/wielders";
import { getTerm, TermsDTO } from "../../lib/terms";

const Wielder: NextPage<{ wielder: WielderDTO; terms: TermsDTO }> = ({
  wielder,
  terms,
}) => {
  const level = wielder.skills
    ? wielder.skills.find((skill) => skill.id === wielder.stats.command)
        ?.level || wielder.skills.at(-1)?.level
    : 0;

  return (
    <Stack>
      <Title order={4}>{wielder.name}</Title>
      <SpriteSheet spriteSheet={wielder.portrait} folder="wielders" />
      <Blockquote>{wielder.description}</Blockquote>
      <Table>
        <tbody>
          <tr>
            <td>{terms.offense}</td>
            <td>{wielder.stats.offense}</td>
          </tr>
          <tr>
            <td>{terms.defense}</td>
            <td>{wielder.stats.defense}</td>
          </tr>
          <tr>
            <td>{terms.movement}</td>
            <td>{wielder.stats.movement}</td>
          </tr>
          <tr>
            <td>{terms.viewRadius}</td>
            <td>{wielder.stats.viewRadius}</td>
          </tr>
          <tr>
            <td>{terms.command}</td>
            <td>{level}</td>
          </tr>
        </tbody>
      </Table>
      <Title order={5}>{terms.startingTroops}</Title>
      {wielder.units.map((unit) => (
        <Text key={`${wielder.name}-${unit.name}`}>
          <Text
            sx={(theme) => ({ color: theme.colors[theme.primaryColor][5] })}
            component="span"
          >
            {unit.size}
          </Text>{" "}
          {unit.name}
        </Text>
      ))}
      <Title order={5}>{terms.skills}</Title>
      {wielder.skills.map((skill, index) => (
        <Text key={index}>{skill.name}</Text>
      ))}
    </Stack>
  );
};

export default Wielder;

export const getStaticProps = withStaticBase(async (context) => {
  const type = context.params!.type as string;
  const locale = context.locale!;

  const wielder = getWielder(type, context.locale!);
  if (!wielder) {
    return {
      notFound: true,
    };
  }

  const terms: TermsDTO = {
    offense: getTerm("Commanders/Details/CommanderStat/Offense", locale),
    defense: getTerm("Commanders/Details/CommanderStat/Defense", locale),
    movement: getTerm("Commanders/Details/CommanderStat/Movement", locale),
    viewRadius: getTerm("Commanders/Details/CommanderStat/View", locale),
    command: getTerm("Commanders/Details/CommanderStat/Command", locale),
    startingTroops: getTerm(
      "Adventure/PurchaseWielderMenu/TroopsAtStartHeader",
      locale
    ),
    skills: getTerm("Tutorial/CodexCategory/Skills", locale),
  };

  return {
    props: {
      wielder,
      terms,
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
