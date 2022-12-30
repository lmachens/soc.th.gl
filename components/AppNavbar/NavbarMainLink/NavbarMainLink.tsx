import { Box, ThemeIcon } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import useStyles from "./NavbarMainLink.styles";

type Props = {
  href: string;
  icon: ReactNode;
  children: ReactNode;
};
const NavbarMainLink = ({ href, icon, children }: Props) => {
  const { asPath } = useRouter();

  const { classes, cx } = useStyles();

  return (
    <Box
      component={Link}
      href={href}
      prefetch={false}
      className={cx(classes.mainLink, asPath === href && classes.active)}
    >
      <ThemeIcon size={30} radius="lg" color="dark">
        {icon}
      </ThemeIcon>
      <div className={classes.body}>{children}</div>
    </Box>
  );
};

export default NavbarMainLink;
