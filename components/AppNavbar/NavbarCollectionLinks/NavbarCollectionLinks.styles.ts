import { createStyles } from "@mantine/core";

export default createStyles((theme) => ({
  category: {
    marginBottom: theme.spacing.xl * 1.2,
  },

  categoryCollapsed: {
    marginBottom: 0,
  },

  header: {
    ...theme.fn.focusStyles(),
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    width: `calc(100% + ${theme.spacing.md}px)`,
    color: theme.white,
    height: 32,
    border: 0,
    padding: `0 ${theme.spacing.md}px`,
    paddingLeft: 0,
    cursor: "pointer",
  },

  icon: {
    width: 15,
    height: 15,
    marginRight: theme.spacing.md,
    transform: "rotate(0deg)",
    transition: "transform 150ms ease",
  },

  iconCollapsed: {
    transform: "rotate(-90deg)",
  },

  innerCategory: {
    paddingTop: 15,
  },

  innerCategoryIcon: {
    marginRight: 10,
    width: 14,
    height: 14,
  },

  innerCategoryTitle: {
    position: "relative",
    paddingLeft: 23,
    marginLeft: 7,
    marginBottom: 5,
    borderLeft: `1px solid ${theme.colors.dark[6]}`,
    height: 34,
    display: "flex",
    alignItems: "center",
    fontSize: theme.fontSizes.xs,
    backgroundColor: theme.colors.dark[7],
    color: theme.colors.dark[2],
    borderTopRightRadius: theme.radius.sm,
    borderBottomRightRadius: theme.radius.sm,
  },

  link: {
    ...theme.fn.focusStyles(),
    WebkitTapHighlightColor: "transparent",
    borderLeft: `1px solid ${theme.colors.dark[6]}`,
    outline: 0,
    display: "block",
    textDecoration: "none",
    color: theme.colors.dark[1],
    paddingLeft: 23,
    paddingRight: theme.spacing.md,
    marginLeft: 7,
    borderTopRightRadius: theme.radius.sm,
    borderBottomRightRadius: theme.radius.sm,
    fontSize: theme.fontSizes.sm,
    userSelect: "none",
    maxWidth: "calc(100% - 7px)",
  },

  linkInner: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  linkActive: {
    borderLeftColor: theme.colors.brand[5],
    backgroundColor: theme.fn.rgba(theme.colors.brand[7], 0.45),
    color: theme.colors.brand[2],
    fontWeight: 500,
  },

  title: {
    userSelect: "none",
    fontWeight: 700,
    fontFamily: '"Cinzel", serif',
    lineHeight: 1,
    paddingTop: 4,
    color: theme.colors.brand[4],
    letterSpacing: 0.5,
    wordSpacing: 1,
    fontSize: 11,
    textTransform: "uppercase",
  },
}));
