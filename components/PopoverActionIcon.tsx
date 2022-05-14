import { ActionIcon, Popover } from "@mantine/core";
import { MouseEventHandler, ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
  popover: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
};
const PopoverActionIcon = ({ children, popover, onClick }: Props) => {
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
        <ActionIcon
          sx={(theme) => ({
            width: "auto",
            height: "auto",
            padding: theme.spacing.sm,
          })}
          onMouseEnter={() => setOpened(true)}
          onMouseLeave={() => setOpened(false)}
          onClick={onClick}
        >
          {children}
        </ActionIcon>
      }
    >
      {popover}
    </Popover>
  );
};

export default PopoverActionIcon;
