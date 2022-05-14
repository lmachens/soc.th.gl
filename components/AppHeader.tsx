import { Button, Grid, Group, Header, Title, Tooltip } from "@mantine/core";
import Link from "next/link";

const AppHeader = () => {
  return (
    <Header height={60} p="md">
      <Grid justify="space-between">
        <Title order={1}>SoC.gg</Title>
        <Group>
          <Link href="/" passHref>
            <Button component="a" variant="subtle">
              Database
            </Button>
          </Link>
          <Link href="/skillbuilder" passHref>
            <Button component="a" variant="subtle">
              Skill Builder
            </Button>
          </Link>
          <Tooltip label="Coming soon" position="bottom" withArrow>
            <Button variant="subtle">Guides</Button>
          </Tooltip>
          <Tooltip label="Coming soon" position="bottom" withArrow>
            <Button variant="subtle">Discord</Button>
          </Tooltip>
          <Tooltip label="Coming soon" position="bottom" withArrow>
            <Button variant="subtle">GitHub</Button>
          </Tooltip>
        </Group>
      </Grid>
    </Header>
  );
};

export default AppHeader;
