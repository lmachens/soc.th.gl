import { Box, Stack, Text, Title } from "@mantine/core";
import { MilestoneIcon } from "@primer/octicons-react";
import { ReactNode } from "react";
import AppLink from "../AppLink/AppLink";

type Props = {
  image: ReactNode;
  name: string;
  description: string;
  href: string;
  children?: ReactNode;
};
const Article = ({ image, name, description, href, children }: Props) => {
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
        <Text size="sm" sx={{ fontStyle: "italic" }}>
          {description}
        </Text>
        {children}
        <AppLink href={href}>
          <MilestoneIcon /> Learn more
        </AppLink>
      </Stack>
    </Box>
  );
};

export default Article;
