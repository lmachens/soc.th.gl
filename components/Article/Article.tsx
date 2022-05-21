import { Box, Stack, Text, Title } from "@mantine/core";
import { MilestoneIcon } from "@primer/octicons-react";
import { ReactNode } from "react";
import AppLink from "../AppLink/AppLink";

type Props = {
  image: ReactNode;
  name: string;
  description: string;
  href: string;
};
const Article = ({ image, name, description, href }: Props) => {
  return (
    <Box
      component="article"
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: "150px 1fr",
        gap: theme.spacing.lg,
        [theme.fn.smallerThan("sm")]: {
          gridTemplateColumns: "auto",
          justifyItems: "center",
        },
      })}
    >
      {image}
      <Stack>
        <Title order={3}>{name}</Title>
        <Text size="sm">{description}</Text>
        <AppLink href={href}>
          <MilestoneIcon /> Learn more
        </AppLink>
      </Stack>
    </Box>
  );
};

export default Article;
