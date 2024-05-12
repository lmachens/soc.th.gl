import { Container, Group, Text } from "@mantine/core";
import Image from "next/image";
import { useTerms } from "../../components/Terms/Terms";
import LogoSmall from "../../public/logo_small.png";
import ConsentLink from "../Ads/ConsentLink";
import AppLink from "../AppLink/AppLink";
import useStyles from "./AppFooter.styles";
import footerLinks from "./footerLinks";

const AppFooter = () => {
  const { classes } = useStyles();
  const terms = useTerms();

  const groups = footerLinks.map((group) => {
    const links = group.links.map((link) => (
      <AppLink
        className={classes.link}
        key={link.term}
        href={link.href}
        target={link.target}
        title={link.title}
      >
        {terms[link.term] ?? link.term}
      </AppLink>
    ));

    return (
      <div className={classes.wrapper} key={group.term}>
        <Text className={classes.title}>{terms[group.term] ?? group.term}</Text>
        {links}
      </div>
    );
  });
  return (
    <footer className={classes.footer}>
      <Container>
        <Group className={classes.inner}>
          <div className={classes.logo}>
            <AppLink href="/" style={{ display: "flex" }}>
              <Image src={LogoSmall} alt="SoC.th.gl" />
            </AppLink>
          </div>
          <div className={classes.groups}>{groups}</div>
        </Group>
        <Group className={classes.afterFooter}>
          <Text color="dimmed" size="sm">
            © 2024 The Hidden Gaming Lair. All rights reserved.
          </Text>
          <ConsentLink />
        </Group>
      </Container>
    </footer>
  );
};

export default AppFooter;
