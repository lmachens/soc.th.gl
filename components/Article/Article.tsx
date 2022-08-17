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
        gap: theme.spacing.lg,
        [theme.fn.smallerThan("xs")]: {
          gridTemplateColumns: "auto",
        },
      })}
    >
      {image}
      <Stack spacing="xs">
        <Title order={3}>{name}</Title>
        {subtitle && <Text size="sm">{subtitle}</Text>}
        {description && <Lore text={description} />}
        {children}
        {href && (
          <AppLink href={href}>
            <MilestoneIcon /> {terms.LearnMore}
          </AppLink>
        )}
      </Stack>
    </Box>
  );
};

export default Article;
