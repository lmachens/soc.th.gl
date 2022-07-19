import { createStyles } from "@mantine/core";

export default createStyles((theme) => ({
  container: {
    display: "flex",
  },
  label: {
    color: theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    width: 150,
  },
  value: {
    fontSize: theme.fontSizes.sm,
  },
}));
