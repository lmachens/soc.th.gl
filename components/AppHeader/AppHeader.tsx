import { Box, Burger, Group, Header, MediaQuery } from "@mantine/core";
import { DiscordIcon } from "./DiscordIcon";
import { MarkGithubIcon } from "@primer/octicons-react";
import { HeaderControl } from "./HeaderControl/HeaderControl";
import Image from "next/image";
import LogoSmall from "../../public/logo_small.png";
import AppLink from "../AppLink/AppLink";

type Props = {
  openedBurger: boolean;
  onBurgerClick: () => void;
};
const AppHeader = ({ openedBurger, onBurgerClick }: Props) => {
  return (
    <Header
      height={70}
      p="md"
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={openedBurger}
            onClick={onBurgerClick}
            size="sm"
            mr="xl"
          />
        </MediaQuery>
        <AppLink href="/" style={{ display: "flex" }}>
          <Image src={LogoSmall} alt="SOC.GG" />
        </AppLink>
      </Box>
      <Group spacing="xs">
        <HeaderControl
          link="https://discord.com/invite/NTZu8Px"
          tooltip="Join the community"
          variant="discord"
        >
          <DiscordIcon size={20} />
        </HeaderControl>

        <HeaderControl
          link="https://github.com/lmachens/soc.gg"
          tooltip="Contribute or give feedback"
        >
          <MarkGithubIcon size={20} />
        </HeaderControl>
      </Group>
    </Header>
  );
};

export default AppHeader;
