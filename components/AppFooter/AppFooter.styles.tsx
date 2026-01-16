import { createStyles } from "@mantine/core";

export default createStyles((theme) => ({
  footer: {
    marginTop: "auto",
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    borderTop: `1px solid ${theme.fn.rgba(theme.colors.brand[7], 0.2)}`,
    backgroundColor: theme.colors.dark[8],
  },

  logo: {
    maxWidth: 200,

    [theme.fn.smallerThan("sm")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },

  description: {
    marginTop: 5,

    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xs,
      textAlign: "center",
    },
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },

  groups: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },

  wrapper: {
    width: 160,
  },

  link: {
    display: "block",
    color: theme.colors.gray[5],
    fontSize: theme.fontSizes.sm,
    paddingTop: 4,
    paddingBottom: 4,
    transition: "color 0.2s ease",

    "&:hover": {
      color: theme.colors.brand[4],
      textDecoration: "none",
    },
  },

  title: {
    fontSize: 12,
    fontWeight: 600,
    fontFamily: '"Cinzel", serif',
    marginBottom: theme.spacing.sm,
    color: theme.colors.brand[4],
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  afterFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${theme.fn.rgba(theme.colors.dark[5], 0.5)}`,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },

  social: {
    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xs,
    },
  },
}));
