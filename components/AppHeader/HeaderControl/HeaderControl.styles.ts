import { createStyles } from "@mantine/core";

export default createStyles((theme) => ({
  control: {
    ...theme.fn.focusStyles(),
    width: 34,
    height: 34,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.dark[4]}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.white,
    backgroundColor: theme.colors.dark[5],
    transition: "background-color 0.2s ease",

    "&:hover": {
      backgroundColor: theme.colors.dark[4],
    },

    [theme.fn.smallerThan("sm")]: {
      display: "none",
      position: "absolute",
      right: 0,
    },
  },

  container: {
    [theme.fn.smallerThan("sm")]: {
      position: "fixed",
      top: 14,
      right: theme.spacing.md,
    },
  },

  discord: {
    color: theme.white,
    backgroundColor: "#5865f2",
    borderColor: "#5865f2",

    "&:hover": {
      backgroundColor: theme.fn.lighten("#5865f2", 0.1),
    },
  },
}));
