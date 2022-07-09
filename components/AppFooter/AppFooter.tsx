import { Text, Container } from '@mantine/core';
import { footerTextLinks } from './FooterTextLinks'
import AppLink from '../AppLink/AppLink';
import Image from 'next/image';
import LogoSmall from '../../public/logo_small.png';
import useStyles from './AppFooter.styles';

const AppFooter = () => {
  const { classes } = useStyles();
  const groups = footerTextLinks.map((group) => {
    const links = group.links.map((link) => (
      <AppLink className={classes.link} key={link.link} href={link.link} >
        {link.label}
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