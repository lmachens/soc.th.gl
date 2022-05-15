import React, { ReactNode } from "react";
import { Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useStyles from "./HeaderControl.styles";

interface HeaderControlProps {
  tooltip: string;
  link: string;
  variant?: "discord";
  children: ReactNode;
}

export function HeaderControl({
  tooltip,
  link,
  variant,
  children,
}: HeaderControlProps) {
  const { classes, cx, theme } = useStyles();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  return (
    <Tooltip
      label={tooltip}
      disabled={isMobile}
      className={classes.container}
      transitionDuration={0}
      openDelay={500}
    >
      <a
        className={cx(classes.control, variant && classes[variant])}
        href={link}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    </Tooltip>
  );
}
