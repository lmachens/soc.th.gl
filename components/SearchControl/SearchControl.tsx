import React from "react";
import { UnstyledButton, Text, Group, Grid } from "@mantine/core";
import { useSpotlight } from "@mantine/spotlight";
import { SearchIcon } from "@primer/octicons-react";
import Shortcut from "./Shortcut";
import { ClientOnly } from "../ClientOnly/ClientOnly";

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
        width: "100%",
        "&:hover": {
          backgroundColor: theme.fn.rgba(theme.colors.dark[5], 0.85),
        },
      })}
    >
      <Grid justify="space-between" align="center" px="xs">
        <Group spacing="xs">
          <SearchIcon size={14} />
          <Text size="sm" color="dimmed">
            Search
          </Text>
        </Group>
        <ClientOnly>{() => <Shortcut />}</ClientOnly>
      </Grid>
    </UnstyledButton>
  );
}
