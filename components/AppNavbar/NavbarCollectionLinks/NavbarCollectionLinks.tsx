import { Text } from "@mantine/core";
import { ChevronDownIcon } from "@primer/octicons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CollectionLink } from "../../../lib/staticProps";
import useStyles from "./NavbarCollectionLinks.styles";

function hasActiveLink(collectionLink: CollectionLink, pathname: string) {
  if (
    collectionLink.docs.some((collectionLink) => collectionLink.to === pathname)
  ) {
    return true;
  }

  return false;
}

type Props = {
  collectionLink: CollectionLink;
};
const NavbarCollectionLinks = ({ collectionLink }: Props) => {
  const { classes, cx } = useStyles();
  const { asPath } = useRouter();
  const [collapsed, setCollapsed] = useState(
    () => !hasActiveLink(collectionLink, asPath)
  );

  const docLinks = collectionLink.docs.map((doc) => (
    <Link key={doc.to} href={doc.to} passHref prefetch={false}>
      <Text
        component="a"
        className={cx(classes.link, doc.to === asPath && classes.linkActive)}
      >
        {doc.label}
      </Text>
    </Link>
  ));

  useEffect(() => {
    const activeLink = hasActiveLink(collectionLink, asPath);
    if (activeLink && collapsed) {
      setCollapsed(false);
    }
  }, [asPath]);

  return (
    <div
      className={cx(classes.category, {
        [classes.categoryCollapsed]: collapsed,
      })}
    >
      <button
        className={classes.header}
        type="button"
        onClick={() => setCollapsed((c) => !c)}
      >
        <ChevronDownIcon
          className={cx(classes.icon, { [classes.iconCollapsed]: collapsed })}
        />
        <Text
          className={classes.title}
          weight={700}
          size="xs"
          transform="uppercase"
        >
          {collectionLink.label}
        </Text>
      </button>
      {!collapsed && docLinks}
    </div>
  );
};

export default NavbarCollectionLinks;
