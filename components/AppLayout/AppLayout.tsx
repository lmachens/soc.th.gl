import { AppShell, Container } from "@mantine/core";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { CollectionLink } from "../../lib/staticProps";
import AppHeader from "../AppHeader/AppHeader";
import AppNavbar from "../AppNavbar/AppNavbar";

type Props = {
  collectionLinks: CollectionLink[];
  children: ReactNode;
};
const AppLayout = ({ collectionLinks, children }: Props) => {
  const [openedNavbar, setOpenedNavbar] = useState(false);
  const { asPath } = useRouter();

  useEffect(() => {
    setOpenedNavbar(false);
  }, [asPath]);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      header={
        <AppHeader
          openedBurger={openedNavbar}
          onBurgerClick={() => setOpenedNavbar((opened) => !opened)}
        />
      }
      navbar={
        <AppNavbar opened={openedNavbar} collectionLinks={collectionLinks} />
      }
    >
      <Container>{children}</Container>
    </AppShell>
  );
};

export default AppLayout;
