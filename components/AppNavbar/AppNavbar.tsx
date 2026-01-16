import { Navbar, ScrollArea, Space } from "@mantine/core";
import { RepoIcon } from "@primer/octicons-react";
import { CollectionLink } from "../../lib/staticProps";
import { SearchControl } from "../SearchControl/SearchControl";
import NavbarCollectionLinks from "./NavbarCollectionLinks/NavbarCollectionLinks";
import NavbarMainLink from "./NavbarMainLink/NavbarMainLink";

export const APP_NAVBAR_WIDTH_SM = 200;
export const APP_NAVBAR_WIDTH_LG = 300;

type Props = {
  collectionLinks: CollectionLink[];
  opened: boolean;
};
const AppNavbar = ({ collectionLinks, opened }: Props) => {
  const links = collectionLinks.map((collectionLink) => (
    <NavbarCollectionLinks
      key={collectionLink.label}
      collectionLink={collectionLink}
    />
  ));
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: APP_NAVBAR_WIDTH_SM, lg: APP_NAVBAR_WIDTH_LG }}
      sx={(theme) => ({
        backgroundColor: theme.colors.dark[8],
        borderRightColor: theme.fn.rgba(theme.colors.brand[7], 0.2),
      })}
    >
      <ScrollArea
        styles={{
          root: {
            height: "100%",
          },
          viewport: {
            "> div": {
              display: "block !important",
            },
          },
        }}
        type="scroll"
      >
        <SearchControl />
        <Space h="md" />
        <NavbarMainLink icon={<RepoIcon />} href="/savegames">
          Savegames
        </NavbarMainLink>
        <Space h="xs" />
        {links}
      </ScrollArea>
    </Navbar>
  );
};

export default AppNavbar;
