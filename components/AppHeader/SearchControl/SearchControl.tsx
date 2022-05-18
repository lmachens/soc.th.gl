import React from "react";
import { UnstyledButton, Text, Group } from "@mantine/core";
import { useSpotlight } from "@mantine/spotlight";
import { SearchIcon } from "@primer/octicons-react";
import Shortcut from "./Shortcut";

export function SearchControl(props: React.ComponentPropsWithoutRef<"button">) {
  const spotlight = useSpotlight();

  return (
    <UnstyledButton
      {...props}
      pl="sm"
      pr={5}
      onClick={spotlight.openSpotlight}
      sx={(theme) => ({
        height: 34,
        borderRadius: theme.radius.md,
        color: theme.colors.dark[2],
        backgroundColor: theme.colors.dark[5],
        border: `1px solid ${theme.colors.dark[5]}`,

        "&:hover": {
          backgroundColor: theme.fn.rgba(theme.colors.dark[5], 0.85),
        },

        [theme.fn.smallerThan("sm")]: {
          display: "none",
        },
      })}
    >
      <Group spacing="xs">
        <SearchIcon size={14} />
        <Text size="sm" color="dimmed" pr={80}>
          Search
        </Text>
        <Shortcut />
      </Group>
    </UnstyledButton>
  );
}
