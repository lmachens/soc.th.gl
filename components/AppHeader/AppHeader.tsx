import { Box, Burger, Group, Header, MediaQuery } from "@mantine/core";
import { DiscordIcon } from "./DiscordIcon";
import { HeaderControl } from "./HeaderControl/HeaderControl";
import Image from "next/image";
import LogoSmall from "../../public/logo_small.png";
import AppLink from "../AppLink/AppLink";
import { useTerms } from "../Terms/Terms";
import LocaleSelector from "./LocaleSelector/LocaleSelector";

type Props = {
  openedBurger: boolean;
  onBurgerClick: () => void;
};
const AppHeader = ({ openedBurger, onBurgerClick }: Props) => {
  const terms = useTerms();

  return (
    <Header
      height={70}
      p="md"
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        height: "100%",
        justifyContent: "space-between",
        backgroundColor: theme.colors.dark[8],
        borderBottomColor: theme.fn.rgba(theme.colors.brand[7], 0.2),
      })}
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
          <Image src={LogoSmall} alt="SoC.th.gl" />
        </AppLink>
      </Box>
      <Group spacing="sm">
        <LocaleSelector />
        <HeaderControl
          link="https://th.gl/discord"
          tooltip={terms.DiscordTooltip}
          variant="discord"
        >
          <DiscordIcon size={20} />
        </HeaderControl>
      </Group>
    </Header>
  );
};

export default AppHeader;
