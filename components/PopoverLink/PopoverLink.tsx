import { Box, Popover } from "@mantine/core";
import { ReactNode, useState } from "react";
import AppLink from "../AppLink/AppLink";

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
      position="top"
      placement="start"
      withArrow
      trapFocus={false}
      closeOnEscape={false}
      transition="pop-top-left"
      width={260}
      styles={{ body: { pointerEvents: "none" } }}
      target={
        <AppLink href={href}>
          <Box
            onMouseEnter={() => setOpened(true)}
            onMouseLeave={() => setOpened(false)}
          >
            {children}
          </Box>
        </AppLink>
      }
    >
      {popover}
    </Popover>
  );
};

export default PopoverLink;
