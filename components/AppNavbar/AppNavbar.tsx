import { Navbar, ScrollArea } from "@mantine/core";
import { HomeIcon } from "@primer/octicons-react";
import { CollectionLink } from "../../lib/staticProps";
import NavbarCollectionLinks from "./NavbarCollectionLinks/NavbarCollectionLinks";
import NavbarMainLink from "./NavbarMainLink/NavbarMainLink";

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
      width={{ sm: 200, lg: 300 }}
    >
      <ScrollArea style={{ height: "100vh" }} type="scroll">
        <NavbarMainLink href="/" icon={<HomeIcon size={18} />}>
          Home
        </NavbarMainLink>
        {links}
      </ScrollArea>
    </Navbar>
  );
};

export default AppNavbar;
