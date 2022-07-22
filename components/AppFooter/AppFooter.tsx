import { Text, Container } from "@mantine/core";
import { useTerms } from "../../components/Terms/Terms";
import AppLink from "../AppLink/AppLink";
import Image from "next/image";
import LogoSmall from "../../public/logo_small.png";
import useStyles from "./AppFooter.styles";
import footerLinks from "./footerLinks";

const AppFooter = () => {
  const { classes } = useStyles();
  const terms = useTerms();

  const groups = footerLinks.map((group) => {
    const links = group.links.map((link) => (
      <AppLink className={classes.link} key={link.term} href={link.href}>
        {terms[link.term]}
      </AppLink>
    ));

    return (
      <div className={classes.wrapper} key={group.term}>
        <Text className={classes.title}>{terms[group.term]}</Text>
        {links}
      </div>
    );
  });
  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <AppLink href="/" style={{ display: "flex" }}>
            <Image src={LogoSmall} alt="SoC.GG" />
          </AppLink>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text color="dimmed" size="sm">
          © 2022 SoC.GG. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
};

export default AppFooter;
