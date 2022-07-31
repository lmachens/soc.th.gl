import { Box, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ReactNode } from "react";
import AppLink from "../AppLink/AppLink";

type Props = {
  children: ReactNode;
  popover: ReactNode;
  href: string;
};
const PopoverLink = ({ children, popover, href }: Props) => {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Popover
      opened={opened}
      position="top"
      withArrow
      onClose={close}
      trapFocus={false}
      closeOnEscape={false}
      transition="pop-top-left"
      width={260}
    >
      <Popover.Target>
        <Box onMouseEnter={open} onMouseLeave={close}>
          <AppLink href={href}>{children}</AppLink>
        </Box>
      </Popover.Target>
      <Popover.Dropdown sx={{ pointerEvents: "none" }}>
        {popover}
      </Popover.Dropdown>
    </Popover>
  );
};

export default PopoverLink;
