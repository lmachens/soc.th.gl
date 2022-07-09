import { Anchor } from "@mantine/core";
import Link from "next/link";
import { CSSProperties, ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};
const AppLink = ({ href, children, style, className }: Props) => {
  return (
    <Link href={href} passHref prefetch={false}>
      <Anchor className={className} color="gray" style={style}>
        {children}
      </Anchor>
    </Link>
  );
};

export default AppLink;
