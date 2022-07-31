import { Anchor, AnchorProps } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";
import type { PolymorphicComponentProps } from "@mantine/utils";

type Props = {
  href: string;
  children: ReactNode;
} & PolymorphicComponentProps<"a", AnchorProps>;
const AppLink = ({ href, children, ...anchorProps }: Props) => {
  return (
    <Link href={href} passHref prefetch={false}>
      <Anchor
        sx={(theme) => ({
          color: theme.colors.gray[5],
        })}
        {...anchorProps}
      >
        {children}
      </Anchor>
    </Link>
  );
};

export default AppLink;
