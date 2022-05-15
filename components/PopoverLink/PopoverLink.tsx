import { Box, Popover } from "@mantine/core";
import Link from "next/link";
import { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
  popover: ReactNode;
  href: string;
};
const PopoverLink = ({ children, popover, href }: Props) => {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="bottom"
      placement="center"
      withArrow
      trapFocus={false}
      closeOnEscape={false}
      transition="pop-top-left"
      width={260}
      styles={{ body: { pointerEvents: "none" } }}
      target={
        <Link href={href} passHref>
          <Box
            component="a"
            onMouseEnter={() => setOpened(true)}
            onMouseLeave={() => setOpened(false)}
          >
            {children}
          </Box>
        </Link>
      }
    >
      {popover}
    </Popover>
  );
};

export default PopoverLink;
