import {
  Anchor,
  Blockquote,
  Box,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import Article from "../components/Article/Article";
import BannerSrc from "../public/banner.jpg";
import LogoSrc from "../public/soc_logo.png";
import Image from "next/image";
import { NextPageWithBanner } from "./_app";
import BannerAd from "../components/Ads/BannerAd";

const Home: NextPageWithBanner = () => {
  return (
    <>
      <Stack>
        <Text size="lg">
          Find all the information you need about building, factions, units,
          skills, spells, wielders and more.
        </Text>
        <SimpleGrid
          breakpoints={[
            { minWidth: "xs", cols: 1 },
            { minWidth: "sm", cols: 2 },
            { minWidth: "lg", cols: 5 },
          ]}
        >
          <Article
            name="Factions"
            description="Four factions representing units, buildings and wielders."
            href={`/factions`}
          />
          <Article
            name="Skills"
            description="Skills are special actions performed in combat."
            href={`/skills`}
          />
          <Article
            name="Units"
            description="Each faction have different units with unique abilities."
            href={`/units`}
          />
          <Article
            name="Wielders"
            description="Your wielder is the commander of your units."
            href={`/wielders`}
          />
          <Article
            name="Artifacts"
            description="Improve your wielder stats with these artifacts."
            href={`/artifacts`}
          />
          <Article
            name="Buildings"
            description="Find out everything you need to know about the buildings."
            href={`/buildings`}
          />
          <Article
            name="Spells"
            description="Your wielder can perform several spells."
            href={`/spells`}
          />
          <Article
            name="Random Events"
            description="Learn what triggers the events at the start of every turn."
            href={`/random-events`}
          />
        </SimpleGrid>
        <Blockquote
          cite={
            <Anchor
              target="_blank"
              href="https://www.songsofconquest.com/"
              color="dimmed"
            >
              – Official Website
            </Anchor>
          }
        >
          <Anchor target="_blank" href="https://www.songsofconquest.com/">
            Songs of Conquest
          </Anchor>{" "}
          is a turn-based strategy game inspired by 90s classics. Lead powerful
          magicians called Wielders and venture to lands unknown. Wage battle
          against armies that dare oppose you and hunt for powerful artifacts.
          The world is ripe for the taking – seize it!
        </Blockquote>
        <Group>
          <Button
            size="md"
            color="gray"
            component="a"
            target="blank"
            href="https://th.gl/discord"
          >
            Join Discord
          </Button>
        </Group>
        <BannerAd />
      </Stack>
    </>
  );
};

Home.getBanner = () => (
  <>
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeContent: "center",
        zIndex: 1,
      }}
    >
      <Image
        src={LogoSrc}
        alt="Songs of Conquest Database"
        width={292}
        height={143}
      />
    </Box>
    <Image
      src={BannerSrc}
      alt="Splashart of Songs of Conquest"
      layout="fill"
      objectFit="cover"
      objectPosition="center 20%"
      placeholder="blur"
      style={{
        maxWidth: 1320,
      }}
    />
  </>
);

export default Home;
