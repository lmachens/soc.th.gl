import { Anchor, AnchorProps } from "@mantine/core";
import Link from "next/link";
import type { LinkProps } from "next/link";
import { ReactNode } from "react";
import type { PolymorphicComponentProps } from "@mantine/utils";

type Props = {
  href: string;
  children: ReactNode;
} & PolymorphicComponentProps<"a", AnchorProps> &
  LinkProps;
const AppLink = ({ href, children, ...anchorProps }: Props) => {
  return (
    <Anchor
      sx={(theme) => ({
        color: theme.colors.gray[5],
      })}
      {...anchorProps}
      component={Link}
      href={href}
      prefetch={false}
    >
      {children}
    </Anchor>
  );
};

export default AppLink;
