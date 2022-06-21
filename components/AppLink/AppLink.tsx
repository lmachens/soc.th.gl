import { Anchor } from "@mantine/core";
import Link from "next/link";
import { CSSProperties, ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  style?: CSSProperties;
};
const AppLink = ({ href, children, style }: Props) => {
  return (
    <Link href={href} passHref prefetch={false}>
      <Anchor color="gray" style={style}>
        {children}
      </Anchor>
    </Link>
  );
};

export default AppLink;
