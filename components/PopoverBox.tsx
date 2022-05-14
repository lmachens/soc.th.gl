import { Box, Popover } from "@mantine/core";
import { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
  popover: ReactNode;
};
const PopoverBox = ({ children, popover }: Props) => {
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
        <Box
          onMouseEnter={() => setOpened(true)}
          onMouseLeave={() => setOpened(false)}
        >
          {children}
        </Box>
      }
    >
      {popover}
    </Popover>
  );
};

export default PopoverBox;
