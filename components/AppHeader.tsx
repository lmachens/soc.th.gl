import { Button, Grid, Group, Header, Title, Tooltip } from "@mantine/core";

const AppHeader = () => {
  return (
    <Header height={60} p="md">
      <Grid justify="space-between">
        <Title order={1}>SoC.gg</Title>
        <Group>
          <Button variant="subtle">Skill Builder</Button>
          <Tooltip label="Coming soon" position="bottom" withArrow>
            <Button variant="subtle">Database</Button>
          </Tooltip>
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
