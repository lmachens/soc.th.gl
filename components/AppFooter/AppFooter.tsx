import { Text, Container } from '@mantine/core';
import { footerTextLinks } from './FooterTextLinks'
import { useTerms } from "../../components/Terms/Terms";
import AppLink from '../AppLink/AppLink';
import Image from 'next/image';
import LogoSmall from '../../public/logo_small.png';
import useStyles from './AppFooter.styles';

const AppFooter = (context: any) => {
  const { classes } = useStyles();
  const terms = useTerms();
  const translatedLinks = Object.entries(terms);

  const groups = footerTextLinks.map((group) => {
    const matches: string[][] = []
    translatedLinks.map((translatedLink) => {
      if (translatedLink[0] === group.key) {
        group.title = translatedLink[1]
      }
      group.links.map((link) => {
        if(translatedLink[0] === link.key) {
          matches.push([link.link, translatedLink[1]])
        }
      })
    })

    const links = matches.map((link) => (
      <AppLink className={classes.link} key={link[0]} href={link[0]} >
        {link[1]}
      </AppLink>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });
  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
        <AppLink href="/" style={{ display: "flex" }}>
          <Image src={LogoSmall} alt="SOC.GG" />
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
}

export default AppFooter;