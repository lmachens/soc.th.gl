import { createStyles, MantineTheme } from "@mantine/core";

export default createStyles((theme: MantineTheme) => ({
  mainLink: {
    ...theme.fn.focusStyles(),
    WebkitTapHighlightColor: "transparent",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: theme.colors.dark[1],
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
    padding: 5,
    marginLeft: -2,
    marginRight: -2,
    borderRadius: theme.radius.sm,
    userSelect: "none",

    "& + &": {
      marginTop: 5,
    },
  },

  active: {
    color: theme.white,
    backgroundColor: theme.fn.rgba(theme.colors.brand[7], 0.45),
  },

  body: {
    marginLeft: theme.spacing.sm,
  },
}));
