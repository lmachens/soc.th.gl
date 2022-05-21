import { Anchor } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
};
const AppLink = ({ href, children }: Props) => {
  return (
    <Link href={href} passHref>
      <Anchor color="gray">{children}</Anchor>
    </Link>
  );
};

export default AppLink;
