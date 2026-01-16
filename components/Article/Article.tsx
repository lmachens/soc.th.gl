import { Box, Stack, Text, Title } from "@mantine/core";
import { MilestoneIcon } from "@primer/octicons-react";
import { ReactNode } from "react";
import AppLink from "../AppLink/AppLink";
import Lore from "../Lore/Lore";
import { useTerms } from "../Terms/Terms";

type Props = {
  image?: ReactNode;
  name: string;
  subtitle?: string;
  description?: string;
  href?: string;
  children?: ReactNode;
};
const Article = ({
  image,
  name,
  subtitle,
  description,
  href,
  children,
}: Props) => {
  const terms = useTerms();

  return (
    <Box
      component="article"
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: image ? "150px 1fr" : "1fr",
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: theme.fn.rgba(theme.colors.dark[7], 0.5),
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.fn.rgba(theme.colors.brand[7], 0.15)}`,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: theme.fn.rgba(theme.colors.dark[7], 0.8),
          borderColor: theme.fn.rgba(theme.colors.brand[6], 0.3),
        },
        [theme.fn.smallerThan("xs")]: {
          gridTemplateColumns: "auto",
        },
      })}
    >
      {image}
      <Stack spacing="xs">
        <Title order={3} sx={{ fontSize: "1.1rem" }}>
          {name}
        </Title>
        {subtitle && (
          <Text size="sm" color="dimmed">
            {subtitle}
          </Text>
        )}
        {description && <Lore text={description} />}
        {children}
        {href && (
          <AppLink
            href={href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 4,
            }}
          >
            <MilestoneIcon size={14} /> {terms.LearnMore}
          </AppLink>
        )}
      </Stack>
    </Box>
  );
};

export default Article;
