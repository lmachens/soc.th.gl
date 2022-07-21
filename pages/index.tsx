import {
  Anchor,
  Blockquote,
  Box,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Article from "../components/Article/Article";
import { withStaticBase } from "../lib/staticProps";
import Markdown from "markdown-to-jsx";
import BannerSrc from "../public/banner.jpg";
import LogoSrc from "../public/soc_logo.png";
import Image from "next/image";
import { NextPageWithBanner } from "./_app";
import BannerAd from "../components/Ads/BannerAd";

const Home: NextPageWithBanner<{ releases: GitHubRelease[] }> = ({
  releases,
}) => {
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
            href="https://discord.com/invite/NTZu8Px"
          >
            Join Discord
          </Button>
          <Button
            size="md"
            color="gray"
            component="a"
            target="blank"
            href="https://github.com/lmachens/soc.gg"
          >
            Contribute on GitHub
          </Button>
        </Group>
        <BannerAd />
        <Title order={2}>Changelog</Title>
        {releases.map((release) => (
          <Box
            component="article"
            key={release.id}
            sx={(theme) => ({
              a: {
                color: theme.colors.brand[5],
              },
            })}
          >
            <Title order={4}>{release.name}</Title>
            <aside>{new Date(release.published_at).toLocaleDateString()}</aside>
            <Text>
              <Markdown
                options={{
                  overrides: {
                    a: {
                      props: {
                        target: "_blank",
                      },
                    },
                  },
                }}
              >
                {release.body}
              </Markdown>
            </Text>
          </Box>
        ))}
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

const santizeReleaseBody = (body: string) =>
  body
    .replace(
      /https:\/\/github.com\/lmachens\/soc.gg\/pull\/(\d+)/g,
      (url, id) => `[#${id}](${url})`
    )
    .replace(
      /https:\/\/github.com\/lmachens\/soc.gg\/compare\/(v\d+.\d+.\d+\.\.\.v\d+.\d+.\d+)/g,
      (url, versions) => `[${versions}](${url})`
    )
    .replace(
      /https:\/\/github.com\/lmachens\/soc.gg\/commits\/(v\d+.\d+.\d+)/g,
      (url, version) => `[${version}](${url})`
    );

type GitHubRelease = {
  id: number;
  name: string;
  body: string;
  published_at: string;
  prerelease: boolean;
};
export const getStaticProps = withStaticBase(async () => {
  const response = await fetch(
    "https://api.github.com/repos/lmachens/soc.gg/releases"
  );
  const allReleases = (await response.json()) as GitHubRelease[];
  const releases = allReleases
    .filter((release) => !release.prerelease)
    .map((release) => ({
      ...release,
      body: santizeReleaseBody(release.body),
    }));

  return {
    props: {
      releases,
      terms: {},
    },
    revalidate: false,
  };
});
