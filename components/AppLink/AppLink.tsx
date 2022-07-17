import { Anchor, AnchorProps } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
} & AnchorProps<"a">;
const AppLink = ({ href, children, ...anchorProps }: Props) => {
  return (
    <Link href={href} passHref prefetch={false}>
      <Anchor color="gray" {...anchorProps}>
        {children}
      </Anchor>
    </Link>
  );
};

export default AppLink;
